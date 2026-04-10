import os
from dotenv import load_dotenv

# Load all variables from .env before anything else!
load_dotenv()

from fastapi import FastAPI, Depends
from routes import auth,dashboard
from routes import ai_routes
from fastapi.middleware.cors import CORSMiddleware
from routes import admin_analytics,user_analytics
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dependencies import get_current_user

app = FastAPI(title="AI Monitoring System")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later we restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include auth routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(ai_routes.router, prefix="/ai", tags=["AI Detection"])
app.include_router(admin_analytics.router, prefix="/admin",tags=["Analytics"])
app.include_router(user_analytics.router,prefix="/user",tags=["Analytics"])


# ===============================
# SERVE REACT FRONTEND
# ===============================

frontend_path = os.path.join(os.path.dirname(__file__), "../frontend/dist")

# serve static assets
app.mount("/assets", StaticFiles(directory=f"{frontend_path}/assets"), name="assets")

# serve React index
@app.get("/")
def serve_frontend():
    return FileResponse(f"{frontend_path}/index.html")
@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    return FileResponse(f"{frontend_path}/index.html")
# @app.get("/")
# def home():
#     return {"message": "Backend Running "}


#  TEST PROTECTED ROUTE (only logged user)
@app.get("/protected")
def protected_route(current_user = Depends(get_current_user)):
    return {
        "message": "Protected route working",
        "user": current_user["email"],
        "role": current_user["role"]
    }
from live_socket import manager
from fastapi import WebSocket

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep alive
    except:
        manager.disconnect(websocket)
