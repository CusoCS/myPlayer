# Dockerfile for Django API

# 1. Use an official Python runtime as a parent image
FROM python:3.11-slim

# 2. Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Set the working directory in the container
WORKDIR /app

# 4. Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY patch.sh /app/patch.sh
RUN chmod +x /app/patch.sh
RUN /app/patch.sh

# 5. Copy the project code into the container
COPY . /app/

# 6. Expose the port the app runs on
EXPOSE 8000

# 7. Define the command to run the application
# We will override this in docker-compose, but it's good practice to have it.
CMD ["gunicorn", "music_project.wsgi:application", "--bind", "0.0.0.0:8000"]