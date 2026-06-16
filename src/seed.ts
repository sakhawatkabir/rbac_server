import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('MongoDB connected');

  const users = [
    { name: 'Admin User',    email: 'admin@corp.local',   password: 'Admin@1234',   role: 'Admin'   },
    { name: 'Bob Martinez',  email: 'manager@corp.local', password: 'Manager@1234', role: 'Manager' },
    { name: 'Alice Johnson', email: 'user@corp.local',    password: 'User@1234',    role: 'User'    },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`  ⏭  ${u.email} already exists — skipping`);
      continue;
    }
    await User.create(u);
    console.log(`  ✅  Created ${u.role}: ${u.email}`);
  }

  console.log('\nSeed complete.\n');
  console.log('  Admin:   admin@corp.local   / Admin@1234');
  console.log('  Manager: manager@corp.local / Manager@1234');
  console.log('  User:    user@corp.local    / User@1234');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
