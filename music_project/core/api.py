from .models import Song, Playlist, PlaylistItem, ListeningHistory
from ninja_jwt.authentication import JWTAuth
from googleapiclient.discovery import build
from ninja import NinjaAPI, Schema, Field
from typing import List, Optional
from ninja.errors import Http404
from django.conf import settings
from django.db.models import Count
from datetime import datetime, timedelta
from django.utils import timezone

api = NinjaAPI()


# --- Schemas ---
class SongSchema(Schema):
    video_id: str
    title: str
    artist: str = None
    thumbnail_url: str = None


class PlaylistItemSchema(Schema):
    id: int  # The ID of the playlist item itself, for easy removal
    order: int
    song: SongSchema


class PlaylistSchema(Schema):
    id: int
    name: str
    description: Optional[str] = None
    items: List[PlaylistItemSchema] = []
    song_count: int = Field(0, alias="song_count")
    created_at: datetime
    updated_at: datetime


class PlaylistCreateSchema(Schema):
    name: str
    description: str = None


class SongInteractionSchema(Schema):
    # This schema will be used for adding songs
    video_id: str
    title: str
    artist: str = None
    thumbnail_url: str = None


# This schema will be used to log a played song
class LogPlaySchema(Schema):
    video_id: str


# This schema will be used to return the history list
class HistoryItemSchema(Schema):
    song: SongSchema
    played_at: datetime


@api.get("/songs/search/", response=List[SongSchema])
def search_songs(request, query: str):
    # Simplified version of the YouTube API call logic
    youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)

    api_request = youtube.search().list(
        q=query, part="snippet", type="video", maxResults=5, videoCategoryId="10"
    )
    response = api_request.execute()

    songs = []
    for item in response.get("items", []):
        songs.append(
            {
                "video_id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "artist": item["snippet"].get("channelTitle"),
                "thumbnail_url": item["snippet"]["thumbnails"]["default"]["url"],
            }
        )
    return songs


@api.get("/playlists/", response=List[PlaylistSchema], auth=JWTAuth())
def list_playlists(request):
    """
    Lists all playlists owned by the authenticated user and includes the song count.
    """
    playlists = Playlist.objects.filter(owner=request.user).annotate(
        song_count=Count("playlistitem")
    )
    return playlists


@api.post("/playlists/", response=PlaylistSchema, auth=JWTAuth())
def create_playlist(request, payload: PlaylistCreateSchema):
    # Creates a new playlist for the authenticated user.
    playlist = Playlist.objects.create(owner=request.user, **payload.dict())
    return playlist


@api.post("/playlists/{playlist_id}/add-song/", auth=JWTAuth())
def add_song_to_playlist(request, playlist_id: int, payload: SongInteractionSchema):
    # Adds a song to one of the user's specific playlists.
    playlist = Playlist.objects.get(id=playlist_id, owner=request.user)

    # Get the song from DB, or create it if it's the first time seeing it
    song, created = Song.objects.get_or_create(
        video_id=payload.video_id,
        defaults={
            "title": payload.title,
            "artist": payload.artist,
            "thumbnail_url": payload.thumbnail_url,
        },
    )

    # Add the song to the playlist
    PlaylistItem.objects.create(
        playlist=playlist, song=song, order=playlist.playlistitem_set.count() + 1
    )

    return {"success": True}


@api.delete("/playlist-items/{item_id}/", auth=JWTAuth())
def remove_song_from_playlist(request, item_id: int):
    # Deletes a specific song entry from a playlist.
    # Ensures the user owns the playlist before deleting.
    try:
        # This query finds the playlist item by its ID & verifies that the owner of the playlist it belongs to is the current user.
        playlist_item = PlaylistItem.objects.get(
            id=item_id, playlist__owner=request.user
        )
    except PlaylistItem.DoesNotExist:
        # If the item doesn't exist or the user doesn't own it, raise a 404 error.
        raise Http404("Playlist item not found.")

    # If check passes, delete the item.
    playlist_item.delete()

    return {"success": True}


@api.delete("/playlists/{playlist_id}/", auth=JWTAuth())
def delete_playlist(request, playlist_id: int):
    # Deletes a specific playlist owned by the authenticated user.
    try:
        # Find the playlist by its ID but also ensure it belongs to the user making the request.
        # This is a critical security check.
        playlist = Playlist.objects.get(id=playlist_id, owner=request.user)
    except Playlist.DoesNotExist:
        # If no such playlist is found for this user, return a 404 error.
        raise Http404("Playlist not found.")

    # If the check passes, delete the playlist object.
    playlist.delete()

    # Return a success response.
    return {"success": True}


@api.get("/playlists/{playlist_id}/", response=PlaylistSchema, auth=JWTAuth())
def get_playlist_details(request, playlist_id: int):
    # Retrieves the full details of a single playlist, including its songs.
    try:
        # prefetch_related to efficiently get all related items and songs
        # in a minimal number of database queries.
        playlist = Playlist.objects.prefetch_related("playlistitem_set__song").get(
            id=playlist_id, owner=request.user
        )
    except Playlist.DoesNotExist:
        raise Http404("Playlist not found.")

    # Rename 'playlistitem_set' to 'items' to match schema
    playlist.items = playlist.playlistitem_set.all()

    return playlist


@api.post("/history/log/", auth=JWTAuth())
def log_song_played(request, payload: SongInteractionSchema):
    """
    Logs that a user has played a song.
    It will create the song in the database if it's the first time.
    """
    # Use get_or_create to find the song, or create it if it doesn't exist
    song, created = Song.objects.get_or_create(
        video_id=payload.video_id,
        defaults={
            "title": payload.title,
            "artist": payload.artist,
            "thumbnail_url": payload.thumbnail_url,
        },
    )

    # Now that we are guaranteed to have a song object, create the history record
    ListeningHistory.objects.create(user=request.user, song=song)

    return {"success": True}


@api.get("/history/", response=List[HistoryItemSchema], auth=JWTAuth())
def get_listening_history(request):
    """
    Retrieves the listening history for the user from the last 2 days.
    """
    five_days_ago = timezone.now() - timedelta(days=2)
    history = ListeningHistory.objects.filter(
        user=request.user, played_at__gte=five_days_ago
    ).select_related("song")

    return history
