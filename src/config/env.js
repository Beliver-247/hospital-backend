import 'dotenv/config';

function req(name, fallback = undefined) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') throw new Error(`Missing env var: ${name}`);
  return v;
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  atlasUri: req('ATLAS_URI'),
  jwtSecret: process.env.JWT_SECRET || 'devsecret'
};

export default config;
