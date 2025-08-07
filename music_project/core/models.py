from django.contrib.auth.models import User
from django.db import models


class Song(models.Model):
    video_id = models.CharField(
        max_length=200, unique=True, help_text="YouTube video ID"
    )
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255, blank=True, null=True)
    thumbnail_url = models.URLField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"


class Playlist(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="playlists")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} by {self.owner.username}"


class PlaylistItem(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()  # To maintain the song order
    added_at = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["order"]  # Order items by their 'order' number by default
        unique_together = (
            "playlist",
            "song",
        )  # Ensures a song can only be added once to a playlist

    def __str__(self):
        return f"{self.song.title} in {self.playlist.name}"


class ListeningHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-played_at"]  # Most recent first

    def __str__(self):
        return f"{self.user.username} listened to {self.song.title} at {self.played_at.strftime('%Y-%m-%d %H:%M')}"
