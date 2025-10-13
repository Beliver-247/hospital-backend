import 'dotenv/config';

const required = ['ATLAS_URI', 'JWT_SECRET'];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  atlasUri: process.env.ATLAS_URI,
  jwtSecret: process.env.JWT_SECRET,
};

export default env;
