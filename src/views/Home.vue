<script setup lang="ts">
import Banner from '@/components/Banner.vue';
import Welcome from '@/components/Welcome.vue';
import MeetOurPastors from '@/components/MeetOurPastors.vue';
import NeedToKnow from '@/components/NeedToKnow.vue';
import WelcomeMessage from '@/components/WelcomeMessage.vue';
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()

function openAskUs() {
    document.getElementById('askus-form-view')?.style.setProperty('display', '')
    document.getElementById('askus-thank-view')?.style.setProperty('display', 'none')

        ; (document.getElementById('askus-question') as HTMLInputElement).value = ''
        ; (document.getElementById('askus-mobile') as HTMLInputElement).value = ''

    document.getElementById('askus-overlay')?.classList.add('open')
}
function closeAskUs() {
    document.getElementById('askus-overlay')?.classList.remove('open')
}
function handleOverlayClick(e: MouseEvent) {
    if (e.target === document.getElementById('askus-overlay')) {
        closeAskUs()
    }
}
function submitAskUs() {
    const q = (document.getElementById('askus-question') as HTMLInputElement).value.trim()
    const m = (document.getElementById('askus-mobile') as HTMLInputElement).value.trim()

    if (!q) {
        toast.showToast('Please enter your question')
        return
    }

    if (!m) {
        toast.showToast('Please enter your mobile number')
        return
    }

    document.getElementById('askus-form-view')?.style.setProperty('display', 'none')
    document.getElementById('askus-thank-view')?.style.setProperty('display', 'flex')
}
</script>
<template>
    <Banner />
    <div class="page active" id="page-home">
        <Welcome />
        <div style="display:flex;gap:14px;margin-bottom:24px;">
            <button class="btn btn-primary" @click="openAskUs">💬 Ask Us</button>
            <router-link to="/register"><button class="btn btn-gold">📋 Register My Visit</button></router-link>
        </div>
        <MeetOurPastors />
        <NeedToKnow />
        <WelcomeMessage />
    </div>
    <!-- ASK US MODAL -->
   <div class="modal-overlay" id="askus-overlay" @click="handleOverlayClick($event)">
        <div class="modal-box">
            <button class="modal-close" @click="closeAskUs">✕</button>
            <!-- Form view -->
            <div id="askus-form-view">
                <div class="modal-title">💬 Ask Us Anything</div>
                <div class="modal-sub">Have a question? Send it our way and we'll reach out to you personally.</div>
                <div class="form-grid">
                    <div class="form-group form-full">
                        <label>Your Question</label>
                        <textarea id="askus-question" rows="4" placeholder="Type your question here..."></textarea>
                    </div>
                    <div class="form-group form-full">
                        <label>Mobile Number</label>
                        <input type="tel" id="askus-mobile" placeholder="(555) 000-0000">
                    </div>
                </div>
                <div style="margin-top:20px;">
                    <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px;"
                        @click="submitAskUs">📨 Submit Question</button>
                </div>
            </div>
            <!-- Thank you view -->
            <div class="modal-thank" id="askus-thank-view">
                <div class="thank-icon">🙏</div>
                <div class="thank-title">Thank You!</div>
                <div class="thank-msg">Thank you for your question — we look forward to reaching out to you so we can
                    discuss further.</div>
                <button class="btn btn-gold" style="margin-top:14px;" @click="closeAskUs">Close</button>
            </div>
        </div>
    </div>
</template>