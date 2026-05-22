<script setup lang="ts">
import { onMounted } from 'vue'
import { useToastStore } from '@/stores/toast'
const toast = useToastStore();

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

function captureAndShowWheel() {
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
          <div class="form-grid">
            <!-- Name -->
            <div class="form-group">
              <label>First Name</label>
              <input type="text" placeholder="First name" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Last name" />
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
              <label>Address</label>
              <input type="text" placeholder="Street address, City, ZIP" />
            </div>

            <!-- Civil Status -->
            <div class="form-group form-full">
              <label>Civil Status</label>
              <div class="civil-status-label">
                <label class="radio-pill">
                  <input type="radio" name="civil-status" value="Single" />
                  <span>💍 Single</span>
                </label>
                <label class="radio-pill">
                  <input type="radio" name="civil-status" value="Married" />
                  <span>👫 Married</span>
                </label>
              </div>
            </div>

            <!-- Social Media -->
            <div class="form-group form-full">
              <label>Social Media Account</label>
              <div class="soc-med-label">
                <div>
                  <label class="checkbox-item"><input type="checkbox" id="sm-fb"
                      onchange="toggleSocialField('fb-field', this)" />
                    <span>📘 Facebook</span></label>
                  <input type="text" id="fb-field" class="social-field" placeholder="Your Facebook name or @handle" />
                </div>
                <div>
                  <label class="checkbox-item"><input type="checkbox" id="sm-ig"
                      onchange="toggleSocialField('ig-field', this)" />
                    <span>📸 Instagram</span></label>
                  <input type="text" id="ig-field" class="social-field" placeholder="Your Instagram @username" />
                </div>
                <div>
                  <label class="checkbox-item"><input type="checkbox" id="sm-tt"
                      onchange="toggleSocialField('tt-field', this)" />
                    <span>🎵 TikTok</span></label>
                  <input type="text" id="tt-field" class="social-field" placeholder="Your TikTok @username" />
                </div>
              </div>
            </div>

            <!-- Visit Details -->
            <div class="form-group form-full">
              <label>Visit Details</label>
              <select id="visit-details-select" onchange="handleVisitDetails(this)">
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
              <label>How did you hear about us?</label>
              <select>
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
              <label>Visit Date</label>
              <input type="date" value="2026-05-08" />
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
            <button class="btn btn-primary" @click="captureAndShowWheel">
              💾 Capture Visitor
            </button>
            <button class="btn btn-outline" @click="clear">Clear</button>
          </div>
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