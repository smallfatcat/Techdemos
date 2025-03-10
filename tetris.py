#!/usr/bin/env python

import asyncio
import json
import logging
from websockets.asyncio.server import broadcast, serve

logging.basicConfig()

USERS = set()

VALUE = 0

def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})

def value_event():
    return json.dumps({"type": "value", "value": VALUE})

async def server(websocket):
    global USERS, VALUE
    try:
        # Register user
        USERS.add(websocket)
        # broadcast(USERS, users_event())
        # print(websocket)
        # Send current state to user
        await websocket.send(json.dumps({"type": "open"}))
        # Manage state changes
        async for message in websocket:
            event = json.loads(message)
            print(event)
            broadcast(USERS, json.dumps(event))
            # if event["action"] == "minus":
            #     VALUE -= 1
            #     broadcast(USERS, value_event())
            # elif event["action"] == "plus":
            #     VALUE += 1
            #     broadcast(USERS, value_event())
            # else:
            #     logging.error("unsupported event: %s", event)
    finally:
        # Unregister user
        # print(websocket)
        USERS.remove(websocket)
        # broadcast(USERS, users_event())

async def main():
    async with serve(server, "0.0.0.0", 6789):
        await asyncio.get_running_loop().create_future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())