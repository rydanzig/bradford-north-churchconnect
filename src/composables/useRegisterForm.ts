import { ref, computed, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast'

export function useRegisterForm() {
  const toast = useToastStore()
  
  const formSubmitted = ref(false)
  const civilStatusError = ref(false)
  const ministryInterestError = ref(false)
  const mobileNumberError = ref(false)
  const emailError = ref(false)
  const emailErrorMessage = ref('')

  // Get current date in YYYY-MM-DD format
  const currentDate = computed(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  onMounted(() => {
    // hide the stats, member search and prayer request tabs
    ;['admin-tab-stats', 'admin-tab-search', 'pr-tab-btn'].forEach(id => {
      const el = document.getElementById(id)
      if (el) el.style.display = 'none'
    })
  })

  async function captureAndShowWheel(event: Event) {
    formSubmitted.value = true
    
    const formElement = event.target as HTMLFormElement
    
    // Custom validation for radio buttons
    const civilStatusRadios = formElement.querySelectorAll('input[name="civil-status"]')
    const civilStatusChecked = Array.from(civilStatusRadios).some((radio: any) => radio.checked)
    
    if (!civilStatusChecked) {
      civilStatusError.value = true
      return
    }
    
    civilStatusError.value = false
    
    // Custom validation for mobile number
    const mobileInput = formElement.querySelector('input[type="tel"]') as HTMLInputElement | null
    const mobileValue = mobileInput?.value.trim() || ''
    
    if (mobileValue) {
      // Validate format: must be 09XXXXXXXXX (11 digits starting with 09)
      const mobileRegex = /^09\d{9}$/
      if (!mobileRegex.test(mobileValue)) {
        mobileNumberError.value = true
        mobileInput?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }
    
    mobileNumberError.value = false
    
    // Custom validation for email
    const emailInput = formElement.querySelector('input[type="email"]') as HTMLInputElement | null
    const emailValue = emailInput?.value.trim() || ''
    
    if (emailValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailValue)) {
        emailError.value = true
        emailErrorMessage.value = 'Invalid email format'
        emailInput?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      if (emailValue.length > 150) {
        emailError.value = true
        emailErrorMessage.value = 'Email must not exceed 150 characters'
        emailInput?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }
    
    emailError.value = false
    emailErrorMessage.value = ''
    
    // Custom validation for ministry interest
    const servingMinistryCheckbox = formElement.querySelector('input[value="Serving in Ministry"]') as HTMLInputElement | null
    if (servingMinistryCheckbox?.checked) {
      const ministryCheckboxes = formElement.querySelectorAll('#ministry-interest-section input[type="checkbox"]')
      const anyMinistryChecked = Array.from(ministryCheckboxes).some((checkbox: any) => checkbox.checked)
      
      if (!anyMinistryChecked) {
        ministryInterestError.value = true
        // Scroll to ministry section
        document.getElementById('ministry-interest-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }
    
    ministryInterestError.value = false
    
    if (!formElement.checkValidity()) {
      return // Let browser handle validation
    }

    // Collect form data
    const formData = new FormData(formElement)
    
    // Get civil status
    const civilStatus = (formElement.querySelector('input[name="civil-status"]:checked') as HTMLInputElement)?.value || ''
    
    // Get social media
    const socialMedia = []
    if ((document.getElementById('sm-fb') as HTMLInputElement)?.checked) {
      socialMedia.push({ type: 'Facebook', username: (document.getElementById('fb-field') as HTMLInputElement)?.value || '' })
    }
    if ((document.getElementById('sm-ig') as HTMLInputElement)?.checked) {
      socialMedia.push({ type: 'Instagram', username: (document.getElementById('ig-field') as HTMLInputElement)?.value || '' })
    }
    if ((document.getElementById('sm-tt') as HTMLInputElement)?.checked) {
      socialMedia.push({ type: 'TikTok', username: (document.getElementById('tt-field') as HTMLInputElement)?.value || '' })
    }
    
    // Get visit details
    const visitDetailsSelect = document.getElementById('visit-details-select') as HTMLSelectElement
    const visitDetailsMap: Record<string, string> = {
      'first': 'First Time Visitor',
      'returning': 'Returning Visitor',
      'another-place': 'Visiting from Another Place',
      'another-church': 'Member of Another Church'
    }
    const visitDetails = visitDetailsMap[visitDetailsSelect?.value] || ''
    
    // Get interests
    const interests: string[] = []
    formElement.querySelectorAll('.interested-label input[type="checkbox"]:checked').forEach((checkbox: any) => {
      interests.push(checkbox.value)
    })
    
    // Get serving in ministry
    const servingInMinistry: any[] = []
    if (servingMinistryCheckbox?.checked) {
      formElement.querySelectorAll('#ministry-interest-section input[type="checkbox"]:checked').forEach((checkbox: any) => {
        const label = checkbox.parentElement?.textContent?.trim() || ''
        servingInMinistry.push({ ministry: label, role: 'Volunteer', start_date: new Date().toISOString().split('T')[0] })
      })
    }
    
    // Convert date from YYYY-MM-DD to MM-DD-YYYY
    const visitDateInput = formElement.querySelector('input[type="date"]') as HTMLInputElement
    const visitDateValue = visitDateInput?.value || ''
    const [year, month, day] = visitDateValue.split('-')
    const visitDate = `${month}-${day}-${year}`
    
    // Build request payload
    const payload = {
      first_name: (formElement.querySelector('input[placeholder="First name"]') as HTMLInputElement)?.value || '',
      last_name: (formElement.querySelector('input[placeholder="Last name"]') as HTMLInputElement)?.value || '',
      mobile_number: (formElement.querySelector('input[type="tel"]') as HTMLInputElement)?.value || '',
      email: (formElement.querySelector('input[type="email"]') as HTMLInputElement)?.value || '',
      address: (formElement.querySelector('input[placeholder*="Street address"]') as HTMLInputElement)?.value || '',
      civil_status: civilStatus,
      social_media: JSON.stringify(socialMedia),
      visit_details: visitDetails,
      heard_about_us: (document.getElementById('heard_about_us') as HTMLSelectElement)?.value || '',
      visit_date: visitDate,
      interests: JSON.stringify(interests),
      prayer_request: (formElement.querySelector('textarea') as HTMLTextAreaElement)?.value || '',
      origin_city_country: (document.getElementById('visit-city-field') as HTMLInputElement)?.value || '',
      church_name: (document.getElementById('visit-church-field') as HTMLInputElement)?.value || '',
      serving_in_ministry: JSON.stringify(servingInMinistry)
    }

    try {
      // Send to backend
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${apiBaseUrl}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save member')
      }

      // Success - show wheel
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

      toast.showToast('Visitor captured! Spin to win your gift 🎉', false)
    } catch (error: any) {
      toast.showToast(`Error: ${error.message}`, true)
      console.error('Error submitting form:', error)
    }
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
    const input = event.target as HTMLInputElement
    let value = input.value.trim()
    
    // For Instagram and TikTok, remove @ if user types it at the beginning
    if (platform !== 'facebook' && value.startsWith('@')) {
      value = value.substring(1)
      input.value = value
    }
    // Facebook accepts everything as-is (URLs, @handles, plain names)
  }

  function handleMobileInput(event: Event): void {
    const input = event.target as HTMLInputElement
    // Clear error when user starts typing
    mobileNumberError.value = false
    
    // Remove non-numeric characters
    let value = input.value.replace(/\D/g, '')
    
    // Limit to 11 digits
    if (value.length > 11) {
      value = value.substring(0, 11)
    }
    
    input.value = value
  }

  function handleEmailInput(): void {
    // Clear error when user starts typing
    emailError.value = false
    emailErrorMessage.value = ''
  }

  function toggleMinistrySection(checkbox: HTMLInputElement) {
    const ministrySection = document.getElementById('ministry-interest-section')
    if (!ministrySection) return
    
    if (checkbox.checked) {
      ministrySection.style.display = 'block'
    } else {
      ministrySection.style.display = 'none'
    }
  }

  function clear() {
    // Reset form submitted state
    formSubmitted.value = false
    civilStatusError.value = false
    mobileNumberError.value = false
    emailError.value = false
    emailErrorMessage.value = ''
    
    // Get the form element
    const form = document.querySelector('#capture-form-card form') as HTMLFormElement | null
    if (!form) return
    
    // Reset all form fields
    form.reset()
    
    // Hide social media fields
    const socialFields = ['fb-field', 'ig-field', 'tt-field']
    socialFields.forEach(fieldId => {
      const field = document.getElementById(fieldId) as HTMLInputElement | null
      if (field) {
        field.classList.remove('visible')
        field.required = false
        field.value = ''
      }
    })
    
    // Uncheck social media checkboxes
    const socialCheckboxes = ['sm-fb', 'sm-ig', 'sm-tt']
    socialCheckboxes.forEach(checkboxId => {
      const checkbox = document.getElementById(checkboxId) as HTMLInputElement | null
      if (checkbox) checkbox.checked = false
    })
    
    // Hide visit detail fields
    const cityField = document.getElementById('visit-city-field') as HTMLInputElement | null
    const churchField = document.getElementById('visit-church-field') as HTMLInputElement | null
    
    if (cityField) {
      cityField.classList.remove('visible')
      cityField.required = false
      cityField.value = ''
    }
    
    if (churchField) {
      churchField.classList.remove('visible')
      churchField.required = false
      churchField.value = ''
    }
    
    // Reset visit date to current date
    const visitDateInput = form.querySelector('input[type="date"]') as HTMLInputElement | null
    if (visitDateInput) {
      visitDateInput.value = currentDate.value
    }
    
    toast.showToast('Form cleared')
  }

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
  ]
  const NUM = wheelPrizes.length
  const ARC = (2 * Math.PI) / NUM
  let wheelAngle = 0
  let isSpinning = false

  function drawWheel(angle: number) {
    const canvas = document.getElementById('wheel-canvas') as HTMLCanvasElement | null

    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 4

    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    wheelPrizes.forEach((prize, i) => {
      const start = angle + i * ARC
      const end = start + ARC
      // Slice
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = prize.color
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Emoji + label
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + ARC / 2)
      ctx.textAlign = 'right'
      // emoji
      ctx.font = '22px serif'
      ctx.fillStyle = '#fff'
      ctx.fillText(prize.emoji, r - 10, 7)
      // label
      ctx.font = 'bold 11px Lato, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.fillText(prize.label, r - 36, 7)
      ctx.restore()
    })
  }

  function spinWheel(): void {
    if (isSpinning) return;
    isSpinning = true;
    
    const spinBtn = document.getElementById('spin-btn') as HTMLButtonElement | null;
    const spinResult = document.getElementById('spin-result') as HTMLElement | null;
    
    if (spinBtn) spinBtn.disabled = true;
    if (spinResult) spinResult.style.display = 'none';

    const winIndex: number = Math.floor(Math.random() * NUM);
    // Extra full rotations (5-8) + land on winner
    const extraSpins: number = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
    const targetAngle: number = wheelAngle - (winIndex * ARC + ARC / 2) + extraSpins;
    // Normalize so pointer (top = -PI/2) lands on slice center
    const finalAngle: number = targetAngle - Math.PI / 2;

    const duration: number = 4200;
    const startTime: number = performance.now();
    const startAngle: number = wheelAngle;

    function easeOut(t: number): number {
      return 1 - Math.pow(1 - t, 4);
    }

    function animate(now: number): void {
      const elapsed: number = now - startTime;
      const t: number = Math.min(elapsed / duration, 1);
      wheelAngle = startAngle + (finalAngle - startAngle) * easeOut(t);
      drawWheel(wheelAngle);
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        showWinResult(winIndex);
      }
    }
    requestAnimationFrame(animate);
  }

  function showWinResult(index: number): void {
    const prize = wheelPrizes[index];
    if (!prize) return;
    
    const spinResultIcon = document.getElementById('spin-result-icon') as HTMLElement | null;
    const spinResultText = document.getElementById('spin-result-text') as HTMLElement | null;
    const spinResult = document.getElementById('spin-result') as HTMLElement | null;
    
    if (spinResultIcon) spinResultIcon.textContent = prize.emoji;
    if (spinResultText) spinResultText.textContent = 'You won a ' + prize.label + '!';
    if (spinResult) spinResult.style.display = 'block';
    
    launchConfetti();
    
    setTimeout(() => {
      const spinBtn = document.getElementById('spin-btn') as HTMLButtonElement | null;
      if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.textContent = '🎯 Spin Again!';
      }
    }, 2500);
  }

  interface ConfettiPiece {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    shape: 'rect' | 'circle' | 'ribbon';
    vx: number;
    vy: number;
    angle: number;
    spin: number;
    opacity: number;
  }

  function launchConfetti(): void {
    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pieces: ConfettiPiece[] = [];
    const COLORS: string[] = [
      '#4a9fc7',
      '#c9a96e',
      '#4caf7d',
      '#e05555',
      '#9b59b6',
      '#f39c12',
      '#1abc9c',
      '#e74c3c',
    ];
    const SHAPES: Array<'rect' | 'circle' | 'ribbon'> = ['rect', 'circle', 'ribbon'];

    for (let i = 0; i < 160; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: 6 + Math.random() * 10,
        h: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] || '#4a9fc7',
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)] || 'rect',
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 4,
        angle: Math.random() * 360,
        spin: (Math.random() - 0.5) * 6,
        opacity: 1,
      });
    }

    let frame: number = 0;
    
    function animateConfetti(): void {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      let alive: boolean = false;
      
      pieces.forEach((p: ConfettiPiece) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        if (frame > 90) p.opacity -= 0.012;
        if (p.opacity <= 0 || p.y > canvas.height + 20) return;
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(-p.w / 2, 0);
          ctx.quadraticCurveTo(0, -p.h, p.w / 2, 0);
          ctx.quadraticCurveTo(0, p.h, -p.w / 2, 0);
          ctx.fill();
        }
        ctx.restore();
      });
      
      if (alive) requestAnimationFrame(animateConfetti);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    requestAnimationFrame(animateConfetti);
  }

  return {
    formSubmitted,
    civilStatusError,
    ministryInterestError,
    mobileNumberError,
    emailError,
    emailErrorMessage,
    currentDate,
    captureAndShowWheel,
    toggleSocialField,
    handleVisitDetails,
    handleSocialInput,
    handleMobileInput,
    handleEmailInput,
    toggleMinistrySection,
    clear,
    wheelPrizes,
    drawWheel,
    spinWheel
  }
}

