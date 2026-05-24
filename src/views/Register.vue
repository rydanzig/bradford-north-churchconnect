<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
const toast = useToastStore();

const formSubmitted = ref(false);
const civilStatusError = ref(false);

// Get current date in YYYY-MM-DD format
const currentDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

// ── SPIN WHEEL ─────────────────────────────────────────────
const wheelPrizes = [
  { label: 'Notebook', emoji: '📓', color: '#4a9fc7' },
  { label: 'Pen', emoji: '🖊️', color: '#c9a96e' },
  { label: 'Pencil', emoji: '✏️', color: '#4caf7d' },
  { label: 'Bookmark', emoji: '🔖', color: '#9b59b6' },
  { label: 'Candy', emoji: '🍬', color: '#e05555' },
  { label: 'Notebook', emoji: '📓', color: '#1a9fc7' },
  { label: 'Pen', emoji: '🖊️', color: '#e8a030' },
  { label: 'Candy', emoji: '🍬', color: '#e07755' },
];
const NUM = wheelPrizes.length;
const ARC = (2 * Math.PI) / NUM;
let wheelAngle = 0;
let isSpinning = false;

onMounted(() => {
  // hide the stats, member search and prayer request tabs
  ['admin-tab-stats', 'admin-tab-search', 'pr-tab-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
})

function drawWheel(angle : number) {
  const canvas = document.getElementById('wheel-canvas') as HTMLCanvasElement | null

  if (!canvas) return

  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 4;

  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  wheelPrizes.forEach((prize, i) => {
    const start = angle + i * ARC;
    const end = start + ARC;
    // Slice
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = prize.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emoji + label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + ARC / 2);
    ctx.textAlign = 'right';
    // emoji
    ctx.font = '22px serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(prize.emoji, r - 10, 7);
    // label
    ctx.font = 'bold 11px Lato, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillText(prize.label, r - 36, 7);
    ctx.restore();
  });
}

function captureAndShowWheel(event: Event) {
  formSubmitted.value = true;
  
  const formElement = event.target as HTMLFormElement;
  
  // Custom validation for radio buttons
  const civilStatusRadios = formElement.querySelectorAll('input[name="civil-status"]');
  const civilStatusChecked = Array.from(civilStatusRadios).some((radio: any) => radio.checked);
  
  if (!civilStatusChecked) {
    civilStatusError.value = true;
    return;
  }
  
  civilStatusError.value = false;
  
  if (!formElement.checkValidity()) {
    return; // Let browser handle validation
  }

  const form = document.getElementById('capture-form-card') as HTMLElement | null

  if (form) {
    form.style.transition = 'opacity 0.4s ease'
    form.style.opacity = '0'

    setTimeout(() => {
      form.style.display = 'none'
    }, 400)
  }

  const ws = document.getElementById('wheel-section') as HTMLElement | null

  setTimeout(() => {
    if (!ws) return

    ws.style.display = 'block'
    ws.scrollIntoView({ behavior: 'smooth', block: 'center' })

    drawWheel(wheelAngle)
  }, 450)

  toast.showToast('Visitor captured! Spin to win your gift 🎉')
}

function toggleSocialField(fieldId: string, event: Event) {
  const checkbox = event.target as HTMLInputElement

  const field = document.getElementById(fieldId) as HTMLInputElement | null
  if (!field) return

  if (checkbox.checked) {
    field.classList.add('visible')
    field.required = true
    field.focus()
  } else {
    field.classList.remove('visible')
    field.required = false
    field.value = ''
  }
}

function handleVisitDetails(event: Event) {
  const sel = event.target as HTMLSelectElement
  const cityField = document.getElementById('visit-city-field') as HTMLInputElement | null
  const churchField = document.getElementById('visit-church-field') as HTMLInputElement | null

  cityField?.classList.remove('visible')
  churchField?.classList.remove('visible')
  
  if (cityField) cityField.required = false
  if (churchField) churchField.required = false

  if (sel.value === 'another-place') {
    cityField?.classList.add('visible')
    if (cityField) cityField.required = true
  }

  if (sel.value === 'another-church') {
    churchField?.classList.add('visible')
    if (churchField) churchField.required = true
  }
}

function handleSocialInput(event: Event, platform: string) {
  const input = event.target as HTMLInputElement;
  let value = input.value.trim();
  
  // For Instagram and TikTok, remove @ if user types it at the beginning
  if (platform !== 'facebook' && value.startsWith('@')) {
    value = value.substring(1);
    input.value = value;
  }
  // Facebook accepts everything as-is (URLs, @handles, plain names)
}

function clear() {
  // TODO:
}
</script>
<template>
  <div class="page active" id="page-admin">
    <div class="tabs">
      <button class="tab-btn active" id="admin-tab-capture">📋 Capture</button>
      <button class="tab-btn" id="admin-tab-stats">📈 Stats</button>
      <button class="tab-btn" id="admin-tab-search" >🔍 Member Search</button>
      <button class="tab-btn" id="pr-tab-btn">📬 Prayer Requests <span
          class="notif" id="pr-notif" style="display:none;">0</span></button>
    </div>
    <div class="tab-content active" id="atab-capture">
      <div class="two-col">
        <div class="card" id="capture-form-card">
          <div class="capture-header">✝ New Visitor / Capture Form</div>
          <form @submit.prevent="captureAndShowWheel" :class="{ 'form-submitted': formSubmitted }">
          <div class="form-grid">
            <!-- Name -->
            <div class="form-group">
              <label>First Name <span class="required">*</span></label>
              <input type="text" placeholder="First name" required style="text-transform: capitalize;"/>
            </div>
            <div class="form-group">
              <label>Last Name <span class="required">*</span></label>
              <input type="text" placeholder="Last name" required style="text-transform: capitalize;"/>
            </div>

            <!-- Contact -->
            <div class="form-group form-full">
              <label>Phone Number</label>
              <input type="tel" placeholder="(555) 000-0000" />
            </div>
            <div class="form-group form-full">
              <label>Email Address</label>
              <input type="email" placeholder="email@example.com" />
            </div>
            <div class="form-group form-full">
              <label>Address <span class="required">*</span></label>
              <input type="text" placeholder="Street address, City, ZIP" required style="text-transform: capitalize;"/>
            </div>

            <!-- Civil Status -->
            <div class="form-group form-full">
              <label>Civil Status <span class="required">*</span></label>
              <div class="civil-status-label">
                <label class="radio-pill">
                  <input type="radio" name="civil-status" value="Single" @change="civilStatusError = false" />
                  <span>💍 Single</span>
                </label>
                <label class="radio-pill">
                  <input type="radio" name="civil-status" value="Married" @change="civilStatusError = false" />
                  <span>👫 Married</span>
                </label>
              </div>
              <span v-if="civilStatusError" class="error-message">Please select your civil status</span>
            </div>

            <!-- Social Media -->
            <div class="form-group form-full">
              <label>Social Media Account</label>
              <div class="soc-med-label">
                <div>
                  <label class="checkbox-item"><input type="checkbox" id="sm-fb"
                       @change="toggleSocialField('fb-field', $event)" />
                    <span>📘 Facebook</span></label>
                  <input type="text" id="fb-field" class="social-field" placeholder="Your Facebook name or profile URL"
                         @input="handleSocialInput($event, 'facebook')" />
                </div>
                <div>
                  <label class="checkbox-item"><input type="checkbox" id="sm-ig"
                       @change="toggleSocialField('ig-field', $event)" />
                    <span>📸 Instagram</span></label>
                  <input type="text" id="ig-field" class="social-field" placeholder="Your Instagram username"
                         @input="handleSocialInput($event, 'instagram')" />
                </div>
                <div>
                  <label class="checkbox-item"><input type="checkbox" id="sm-tt"
                      @change="toggleSocialField('tt-field', $event)" />
                    <span>🎵 TikTok</span></label>
                  <input type="text" id="tt-field" class="social-field" placeholder="Your TikTok username"
                         @input="handleSocialInput($event, 'tiktok')" />
                </div>
              </div>
            </div>

            <!-- Visit Details -->
            <div class="form-group form-full">
              <label>Visit Details <span class="required">*</span></label>
              <select id="visit-details-select" required @change="handleVisitDetails($event)">
                <option value="">Select...</option>
                <option value="first">First Time Visitor</option>
                <option value="returning">Returning Visitor</option>
                <option value="another-place">Visiting from Another Place</option>
                <option value="another-church">Member of Another Church</option>
              </select>
              <input type="text" id="visit-city-field" class="social-field mt-8"
                placeholder="Specify City or Country" />
              <input type="text" id="visit-church-field" class="social-field mt-8" placeholder="Specify Church Name" />
            </div>

            <!-- How did you hear -->
            <div class="form-group">
              <label>How did you hear about us? <span class="required">*</span></label>
              <select required>
                <option value="">Select...</option>
                <option>Friend / Family</option>
                <option>Social Media</option>
                <option>Website</option>
                <option>Drive By</option>
                <option>Community Event</option>
              </select>
            </div>

            <!-- Visit Date -->
            <div class="form-group">
              <label>Visit Date <span class="required">*</span></label>
              <input type="date" :value="currentDate" required />
            </div>

            <!-- Interested In -->
            <div class="form-group form-full">
              <label>Interested In</label>
              <div class="interested-label">
                <label class="checkbox-item"><input type="checkbox" value="Spiritual Counseling" /> 🕊️ Spiritual
                  Counseling</label>
                <label class="checkbox-item"><input type="checkbox" value="Join a BS Group" /> 📖 Join a Bible Study
                  Group</label>
                <label class="checkbox-item"><input type="checkbox" value="Knowing more about Christianity" /> ✝ Knowing
                  More
                  About Christianity</label>
                <label class="checkbox-item" id="interest-ministry-chk">
                  <input type="checkbox" value="Serving in Ministry" onchange="toggleMinistrySection(this)" />
                  🙌 Serving in Ministry
                </label>
                <label class="checkbox-item"><input type="checkbox" value="Becoming a Member" /> 🏛️ Becoming a
                  Member</label>
                <label class="checkbox-item"><input type="checkbox" value="Staying Updated" /> 📢 Staying Updated About
                  Events
                  &amp; Activities</label>
                <label class="checkbox-item"><input type="checkbox" value="Connecting to a Network" /> 🤝 Connecting to
                  a
                  Network</label>
                <div id="network-options">
                  <span class="network-options">Select Network(s):</span>
                  <label class="pr-cat-label"><input type="checkbox" value="Youth" /> <span>🧑 Youth</span></label>
                  <label class="pr-cat-label"><input type="checkbox" value="Young Professionals" />
                    <span>💼 Young Professionals</span></label>
                  <label class="pr-cat-label"><input type="checkbox" value="Couples" /> <span>👫 Couples</span></label>
                  <label class="pr-cat-label"><input type="checkbox" value="Seniors" /> <span>🧓 Seniors</span></label>
                </div>
              </div>
            </div>

            <!-- Ministry Interest (hidden until Serving in Ministry is checked) -->
            <div class="form-group form-full" id="ministry-interest-section">
              <label>Ministry Interest</label>
              <div class="checkbox-list" style="margin-top: 6px">
                <label class="checkbox-item"><input type="checkbox" /> 👶 Children's Ministry</label>
                <label class="checkbox-item"><input type="checkbox" /> 🧑 Youth Ministry</label>
                <label class="checkbox-item"><input type="checkbox" /> 🎵 Worship / Choir</label>
                <label class="checkbox-item"><input type="checkbox" /> 🤲 Community Outreach</label>
                <label class="checkbox-item"><input type="checkbox" /> 👥 Men's / Women's Group</label>
              </div>
            </div>

            <!-- Prayer Request -->
            <div class="form-group form-full">
              <label>Prayer Request
                <span class="prayer-request">(optional)</span>
              </label>
              <textarea rows="2" placeholder="Optional prayer request..."></textarea>
            </div>
          </div>
          <div class="capture-visitor">
            <button type="submit" class="btn btn-primary">
              💾 Capture Visitor
            </button>
            <button type="button" class="btn btn-outline" @click="clear">Clear</button>
          </div>
          </form>
        </div>

        <div>
          <!-- SPIN THE WHEEL -->
          <div id="wheel-section" class="wheel-section">
            <div class="card wheel-card">
              <div class="wheel-title">
                🎉 Welcome Gift!
              </div>
              <div class="wheel-subtitle">
                Thank you for registering! Spin the wheel to claim your welcome gift.
              </div>
              <!-- Wheel wrapper -->
              <div class="wheel-wrapper">
                <!-- Pointer -->
                <div class="wheel-pointer">▼</div>
                <canvas id="wheelCanvas" width="280" height="280" class="wheel-canvas"></canvas>
                <!-- Center cap -->
                <div class="wheel-center-cap">✝</div>
              </div>
              <div>
                <button id="spin-btn" class="btn btn-gold spin-btn" onclick="spinWheel()">
                  🎯 Spin to Win!
                </button>
              </div>
              <div id="spin-result" class="spin-result">
                <div id="spin-result-icon" class="spin-result-icon"></div>
                <div id="spin-result-text" class="spin-result-text"></div>
                <div class="spin-result-note">Collect your prize at the welcome desk!</div>
              </div>
            </div>
          </div>
          <!-- END WHEEL -->
          <div class="big-stat stat-spacing">
            <div class="num">1680</div>
            <div class="label">Total Church Members</div>
          </div>
          <div class="card">
            <div class="capture-header">📋 Quick Stats</div>
            <div class="quick-stats-grid">
              <div class="stat-box stat-sky">
                <div class="stat-number text-sky">312</div>
                <div class="stat-label">Last Sunday</div>
              </div>
              <div class="stat-box stat-green-bg">
                <div class="stat-number text-green">24</div>
                <div class="stat-label">New This Month</div>
              </div>
              <div class="stat-box stat-yellow-bg">
                <div class="stat-number text-yellow">18</div>
                <div class="stat-label">Visitors This Month</div>
              </div>
              <div class="stat-box stat-red-bg">
                <div class="stat-number text-red">7</div>
                <div class="stat-label">Inactive (Need Follow-up)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  @import "@/assets/styles/register.css";
  @import "@/assets/styles/wheel-section.css";
</style>