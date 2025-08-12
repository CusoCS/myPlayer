#!/bin/sh

# This script will find the problematic serializers.py file and comment out the scope_delimiter line

# Find the full path to the file
SERIALIZER_FILE=$(find /usr/local/lib/ -name serializers.py | grep dj_rest_auth/registration)

# Check if the file was found
if [ -f "$SERIALIZER_FILE" ]; then
    echo "Patching $SERIALIZER_FILE..."
    # Use sed to find the line and comment it out (add # at the beginning)
    sed -i 's/scope,/#scope,/' "$SERIALIZER_FILE"
    echo "Patch applied."
else
    echo "Warning: dj_rest_auth serializers.py not found. Skipping patch."
fi