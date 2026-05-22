<template>
    <div class="section-title"><span class="icon">💬</span> Welcome Messages</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span style="font-size:13px;color:var(--gray-600);">Recent greetings from the congregation</span>
        <button class="btn btn-outline btn-sm" onclick="viewMoreMessages()">👁 View More Messages</button>
    </div>
    <div class="messages-list" id="messages-list">
        <div class="message-item">
            <div class="message-avatar">JD</div>
            <div class="message-content">
                <div class="message-sender">John & Diana Foster</div>
                <div class="message-text">A genuine pleasure to worship at BBN. The community here has been such a
                    blessing to our family since we moved to the area.</div>
                <div class="message-date">May 4, 2026</div>
            </div>
        </div>
        <div class="message-item">
            <div class="message-avatar">ML</div>
            <div class="message-content">
                <div class="message-sender">Maria Lopez</div>
                <div class="message-text">The children's ministry is absolutely wonderful. My kids look forward to
                    Sunday every week!</div>
                <div class="message-date">May 3, 2026</div>
            </div>
        </div>
        <div class="message-item">
            <div class="message-avatar">RT</div>
            <div class="message-content">
                <div class="message-sender">Robert Thompson</div>
                <div class="message-text">Grateful for the prayer support after my surgery. This church family truly
                    lives out what they preach.</div>
                <div class="message-date">May 1, 2026</div>
            </div>
        </div>
    </div>
</template>