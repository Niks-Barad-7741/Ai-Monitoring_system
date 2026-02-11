# # from fastapi import WebSocket
# # from typing import List

# # class ConnectionManager:
# #     def __init__(self):
# #         self.active_connections: List[WebSocket] = []

# #     async def connect(self, websocket: WebSocket):
# #         await websocket.accept()
# #         self.active_connections.append(websocket)

# #     def disconnect(self, websocket: WebSocket):
# #         self.active_connections.remove(websocket)

# #     async def broadcast(self, data: dict):
# #         for connection in self.active_connections:
# #             await connection.send_json(data)

# # manager = ConnectionManager()
# from fastapi import WebSocket
# from typing import List

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[WebSocket] = []

#     # CONNECT
#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)
#         print("🟢 New client connected")

#     # DISCONNECT
#     def disconnect(self, websocket: WebSocket):
#         if websocket in self.active_connections:
#             self.active_connections.remove(websocket)
#         print("🔴 Client disconnected")

#     # BROADCAST
#     async def broadcast(self, message: str):
#         print("📡 Broadcasting:", message)

#         dead = []

#         for connection in self.active_connections:
#             try:
#                 await connection.send_text(message)
#             except:
#                 dead.append(connection)

#         # remove dead sockets
#         for d in dead:
#             self.disconnect(d)

# manager = ConnectionManager()
from fastapi import APIRouter, WebSocket
from typing import List

router = APIRouter()

# ==============================
# CONNECTION MANAGER
# ==============================
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("🟢 New client connected")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print("🔴 Client disconnected")

    async def broadcast(self, message: str):
        print(f"📡 Broadcasting: {message}")
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

# ==============================
# 🔴 WEBSOCKET ROUTE
# ==============================
@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            # keep connection alive
            await websocket.receive_text()

    except:
        manager.disconnect(websocket)
