from fastapi import FastAPI, Depends
from routes import auth,dashboard
from routes import ai_routes
from fastapi.middleware.cors import CORSMiddleware
from routes import admin_analytics,user_analytics,user_analytics



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



@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}


# 🔐 TEST PROTECTED ROUTE (only logged user)
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
