<script setup lang="ts">
import { useRegisterForm } from '@/composables/useRegisterForm'

const {
  formSubmitted,
  civilStatusError,
  ministryInterestError,
  mobileNumberError,
  emailError,
  emailErrorMessage,
  showWelcomeBanner,
  visitorFirstName,
  showWheelModal,
  showSpinResult,
  prizeClaimed,
  wonPrizeEmoji,
  wonPrizeLabel,
  currentDate,
  captureAndShowWheel,
  toggleSocialField,
  handleVisitDetails,
  handleSocialInput,
  handleMobileInput,
  handleEmailInput,
  handleFirstNameBlur,
  openWheelModal,
  claimPrizeAndGoHome,
  toggleMinistrySection,
  clear,
  spinWheel
} = useRegisterForm()
</script>
<template>
  <canvas id="confetti-canvas"></canvas>
  <div class="page active register-page" id="page-admin">
    <div v-if="showWelcomeBanner" class="register-top-welcome">
      <div class="register-top-welcome__header">
        <span class="register-top-welcome__icon">✝</span>
        <h2 class="register-top-welcome__title">Welcome {{ visitorFirstName }}!</h2>
      </div>
      <p class="register-top-welcome__text">
        Thank you for worshiping with us today! We pray that you continue to grow in your relationship with God and experience His love and grace each day.
      </p>
      <blockquote class="register-top-welcome__verse">
        "Draw near to God, and He will draw near to you." — James 4:8
      </blockquote>
      <p class="register-top-welcome__closing">We hope to see you again next Sunday.</p>
      <button type="button" class="btn btn-gold register-top-welcome__gift-btn" @click="openWheelModal">
        🎁 Claim My Welcome Gift
      </button>
    </div>

    <div class="tabs register-tabs register-tabs--hidden">
      <button class="tab-btn active" id="admin-tab-capture">📋 Capture</button>
      <button class="tab-btn" id="admin-tab-stats">📈 Stats</button>
      <button class="tab-btn" id="admin-tab-search">🔍 Member Search</button>
      <button class="tab-btn" id="pr-tab-btn">
        📬 Prayer Requests
        <span class="notif" id="pr-notif" style="display:none;">0</span>
      </button>
    </div>

    <div class="tab-content active" id="atab-capture">
      <div class="register-layout">
        <div v-if="!showWelcomeBanner" class="card register-form-card" id="capture-form-card">
          <div class="register-form-header">
            <span class="register-form-header__icon">✝</span>
            <div>
              <h1 class="register-form-header__title">New Visitor</h1>
              <p class="register-form-header__subtitle">Capture Form</p>
            </div>
          </div>
          <form @submit.prevent="captureAndShowWheel" :class="{ 'form-submitted': formSubmitted }">
          <div class="form-grid">
            <!-- Name -->
            <div class="form-group">
              <label>First Name <span class="required">*</span></label>
              <input
                type="text"
                placeholder="First name"
                required
                style="text-transform: capitalize;"
                maxlength="100"
                @blur="handleFirstNameBlur"
              />
            </div>
            <div class="form-group">
              <label>Last Name <span class="required">*</span></label>
              <input type="text" placeholder="Last name" required style="text-transform: capitalize;" maxlength="100"/>
            </div>

            <!-- Contact -->
            <div class="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="09XXXXXXXXX (11 digits)"
                @input="handleMobileInput"
                maxlength="11"
              />
              <span v-if="mobileNumberError" class="error-message">Mobile number must be in format 09XXXXXXXXX (11 digits)</span>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                @input="handleEmailInput"
                maxlength="150"
              />
              <span v-if="emailError" class="error-message">{{ emailErrorMessage }}</span>
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
                <div class="field-row-pair social-media-row">
                  <label class="checkbox-item"><input type="checkbox" id="sm-fb"
                       @change="toggleSocialField('fb-field', $event)" />
                    <span>📘 Facebook</span></label>
                  <input type="text" id="fb-field" class="social-field" placeholder="Your Facebook name or profile URL"
                         @input="handleSocialInput($event, 'facebook')" />
                </div>
                <div class="field-row-pair social-media-row">
                  <label class="checkbox-item"><input type="checkbox" id="sm-ig"
                       @change="toggleSocialField('ig-field', $event)" />
                    <span>📸 Instagram</span></label>
                  <input type="text" id="ig-field" class="social-field" placeholder="Your Instagram username"
                         @input="handleSocialInput($event, 'instagram')" />
                </div>
                <div class="field-row-pair social-media-row">
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
              <div class="visit-details-fields">
                <select id="visit-details-select" class="visit-details-select" required @change="handleVisitDetails($event)">
                  <option value="">Select...</option>
                  <option value="first">First Time Visitor</option>
                  <option value="returning">Returning Visitor</option>
                  <option value="another-place">Visiting from Another Place</option>
                  <option value="another-church">Member of Another Church</option>
                </select>
                <div class="visit-details-extra">
                  <input
                    type="text"
                    id="visit-city-field"
                    class="social-field visit-detail-field"
                    placeholder="City or Country"
                  />
                  <input
                    type="text"
                    id="visit-church-field"
                    class="social-field visit-detail-field"
                    placeholder="Church Name"
                  />
                </div>
              </div>
            </div>

            <!-- How did you hear -->
            <div class="form-group">
              <label>How did you hear about us? <span class="required">*</span></label>
              <select required id="heard_about_us">
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
                <div class="ministry-row">
                  <label class="checkbox-item" id="interest-ministry-chk">
                    <input type="checkbox" value="Serving in Ministry" @change="toggleMinistrySection(($event.target as HTMLInputElement))" />
                    🙌 Serving in Ministry
                  </label>
                  <div id="ministry-interest-section" class="ministry-interest-panel">
                    <span class="ministry-interest-label">Ministry Interest <span class="required">*</span></span>
                    <div class="ministry-interest-options">
                      <label class="checkbox-item"><input type="checkbox" @change="ministryInterestError = false" /> 👶 Children's Ministry</label>
                      <label class="checkbox-item"><input type="checkbox" @change="ministryInterestError = false" /> 🧑 Youth Ministry</label>
                      <label class="checkbox-item"><input type="checkbox" @change="ministryInterestError = false" /> 🎵 Worship / Choir</label>
                      <label class="checkbox-item"><input type="checkbox" @change="ministryInterestError = false" /> 🤲 Community Outreach</label>
                      <label class="checkbox-item"><input type="checkbox" @change="ministryInterestError = false" /> 👥 Men's / Women's Group</label>
                    </div>
                    <span v-if="ministryInterestError" class="error-message">Please select at least one ministry interest</span>
                  </div>
                </div>
                <label class="checkbox-item"><input type="checkbox" value="Want to serve as a volunteer" /> 🙋 Want to
                  serve as a volunteer</label>
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

            <!-- Prayer Request -->
            <div class="form-group form-full">
              <label>Prayer Request
                <span class="prayer-request">(optional)</span>
              </label>
              <textarea rows="2" placeholder="Optional prayer request..."></textarea>
            </div>
          </div>
          <div class="capture-visitor">
            <button type="submit" class="btn btn-primary register-submit-btn">
              Register My Visit
            </button>
            <button type="button" class="btn btn-outline register-clear-btn" @click="clear">Clear</button>
          </div>
          </form>
        </div>

        <div v-if="showWheelModal" class="wheel-modal-overlay">
          <div class="wheel-modal-box">
            <div class="wheel-title">🎉 Welcome Gift!</div>
            <div class="wheel-subtitle">
              Spin the wheel to claim your welcome gift.
            </div>
            <div class="wheel-wrapper">
              <div class="wheel-pointer">▼</div>
              <canvas id="wheel-canvas" class="wheel-canvas"></canvas>
              <div class="wheel-center-cap">✝</div>
            </div>
            <div v-if="!showSpinResult">
              <button id="spin-btn" class="btn btn-gold spin-btn" @click="spinWheel">
                🎯 Spin to Win!
              </button>
            </div>
            <div v-if="showSpinResult" class="spin-result spin-result--visible">
              <div class="spin-result-icon">{{ wonPrizeEmoji }}</div>
              <div class="spin-result-text">You won a {{ wonPrizeLabel }}!</div>
              <div class="spin-result-note">Collect your prize at the welcome desk!</div>
              <button
                v-if="prizeClaimed"
                type="button"
                class="btn btn-gold spin-claimed-btn"
                @click="claimPrizeAndGoHome"
              >
                Claimed
              </button>
            </div>
          </div>
        </div>

        <div class="register-hidden-stats" aria-hidden="true">
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