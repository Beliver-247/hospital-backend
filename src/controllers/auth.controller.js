import * as authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated;
  const result = await authService.login(email, password);
  if (!result) return res.status(401).json({ message: 'Invalid email or password' });
  return res.json(result);
});
