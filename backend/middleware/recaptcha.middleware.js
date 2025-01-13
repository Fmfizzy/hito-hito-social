const axios = require('axios');

const verifyRecaptcha = async (token, action) => {
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.CAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const { success, score, action: responseAction } = response.data;

    const SCORE_THRESHOLD = 0.5;
    return {
      isValid: success && score >= SCORE_THRESHOLD && responseAction === action,
      score,
    };
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return { isValid: false, score: 0 };
  }
};

const recaptchaMiddleware = async (req, res, next) => {
  const { captchaToken } = req.body;
  const action = req.path.includes('login') ? 'login' : 'register';

  if (!captchaToken) {
    return res.status(400).json({ error: 'Security verification required' });
  }

  const { isValid, score } = await verifyRecaptcha(captchaToken, action);
  
  if (!isValid) {
    return res.status(400).json({ error: 'Security check failed' });
  }

  req.recaptchaScore = score;
  next();
};

module.exports = recaptchaMiddleware;