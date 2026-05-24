'use server'

interface ContactFormData {
  name: string
  email: string
  message: string
  type: 'question' | 'wholesale' | 'partnership' | 'feedback'
}

export async function submitContactForm(data: ContactFormData) {
  // Validation
  const { name, email, message, type } = data

  if (!name || name.trim().length === 0) {
    return { success: false, error: 'Name is required' }
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Valid email is required' }
  }
  if (!message || message.trim().length === 0) {
    return { success: false, error: 'Message is required' }
  }

  try {
    // TODO: Send email to farm owner
    // For now, just log
    console.log('Contact form submission:', { name, email, message, type })

    // In production:
    // const emailResult = await sendEmail({
    //   to: 'owner@mangotan  gofarm.com',
    //   subject: `Contact Form: ${type}`,
    //   html: `<p>From: ${name} (${email})</p><p>Type: ${type}</p><p>${message}</p>`
    // })

    return {
      success: true,
      message: 'Thanks for reaching out! We\'ll get back to you soon.',
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      error: 'Failed to submit form. Please try again.',
    }
  }
}
