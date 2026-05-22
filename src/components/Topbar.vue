<template>
    <div class="topbar">
        <div class="topbar-brand">
            <span class="cross">✝</span>
            <span>Bradford Church North</span>
        </div>
        <div class="topbar-nav">
            <router-link to="/"><button >🏠 Home</button></router-link>
            <router-link to="/about"><button >🏠 About</button></router-link>
            <button onclick="showPage('members',this)">👤 List</button>
            <button onclick="showPage('attendance',this)" style="display:none;">📊 Attendance</button>
            <button onclick="showPage('admin',this)" style="display:none;">⚙️ Admin Tools</button>
        </div>
    </div>
</template>