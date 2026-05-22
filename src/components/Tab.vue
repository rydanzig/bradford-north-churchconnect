<template>
    <div class="tabs">
        <button class="tab-btn active" id="admin-tab-capture" onclick="showTab('atab-capture',this)">📋 Capture</button>
        <button class="tab-btn" id="admin-tab-stats" onclick="showTab('atab-stats',this)">📈 Stats</button>
        <button class="tab-btn" id="admin-tab-search" onclick="showTab('atab-search',this)">🔍 Member Search</button>
        <button class="tab-btn" id="pr-tab-btn" onclick="showTab('atab-requests',this)">📬 Prayer Requests <span class="notif" id="pr-notif" style="display:none;">0</span></button>
    </div>
</template>