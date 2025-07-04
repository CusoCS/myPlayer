# core/api.py
from ninja import NinjaAPI, Schema
from ninja_jwt.authentication import JWTAuth
from typing import List
from .models import Song
from django.conf import settings

api = NinjaAPI()

# --- Schemas ---
class SongSchema(Schema):
    video_id: str
    title: str
    artist: str = None
    thumbnail_url: str = None

class PlaylistSchema(Schema):
    id: int
    name: str
    description: str = None

class PlaylistCreateSchema(Schema):
    name: str
    description: str = None

class SongInteractionSchema(Schema):
    # This schema will be used for adding/liking songs
    video_id: str
    title: str
    artist: str = None
    thumbnail_url: str = None

@api.get("/songs/search/", response=List[SongSchema])
def search_songs(request, query: str):
    # Simplified version of the YouTube API call logic
    youtube = build('youtube', 'v3', developerKey=settings.YOUTUBE_API_KEY)
    
    api_request = Youtube().list(
        q=query,
        part='snippet',
        type='video',
        maxResults=20
    )
    response = api_request.execute()

    songs = []
    for item in response.get('items', []):
        songs.append({
            'video_id': item['id']['videoId'],
            'title': item['snippet']['title'],
            'artist': item['snippet'].get('channelTitle'),
            'thumbnail_url': item['snippet']['thumbnails']['default']['url']
        })
    return songs