# active_users.py

active_users = set()

# =========================
# 🟢 USER LOGIN
# =========================
def add_user(email):
    active_users.add(email)

# =========================
# 🔴 USER LOGOUT
# =========================
def remove_user(email):
    if email in active_users:
        active_users.remove(email)

# =========================
# 👥 GET COUNT
# =========================
def get_active_count():
    return len(active_users)

def get_all_users():
    return list(active_users)