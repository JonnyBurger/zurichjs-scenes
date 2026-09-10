#!/usr/bin/env python3
"""Download the release media and verify it before replacing local files."""

import hashlib
import json
from pathlib import Path
import tempfile
import urllib.request


ROOT = Path(__file__).resolve().parent.parent


def checksum(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fetch(entry):
    destination = ROOT / entry["path"]
    if destination.exists() and checksum(destination) == entry["sha256"]:
        print(f"Verified {entry['path']}")
        return
    destination.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {entry['path']}", flush=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=destination.parent, delete=False) as output:
            temporary = Path(output.name)
            with urllib.request.urlopen(entry["url"], timeout=120) as response:
                for chunk in iter(lambda: response.read(1024 * 1024), b""):
                    output.write(chunk)
        if temporary.stat().st_size != entry["size"] or checksum(temporary) != entry["sha256"]:
            raise ValueError(f"Media verification failed: {entry['path']}")
        temporary.replace(destination)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


if __name__ == "__main__":
    manifest = json.loads((ROOT / "tools/media-manifest.json").read_text())
    for entry in manifest:
        fetch(entry)
