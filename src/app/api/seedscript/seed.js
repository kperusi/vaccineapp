// ============================================
// FILE: scripts/seed-vaccine-db.js
// ============================================
import sql from '../../lib/db'
import bcrypt from "bcryptjs";


// Sample data
const vaccineTypes = [
  {
    name: "COVID-19 (Pfizer-BioNTech)",
    code: "COVID-PF",
    manufacturer: "Pfizer-BioNTech",
    doses_required: 2,
    interval_days: 21,
    description: "mRNA vaccine for COVID-19",
    age_min: 5,
    age_max: null,
  },
  {
    name: "COVID-19 (Moderna)",
    code: "COVID-MD",
    manufacturer: "Moderna",
    doses_required: 2,
    interval_days: 28,
    description: "mRNA vaccine for COVID-19",
    age_min: 18,
    age_max: null,
  },
  {
    name: "COVID-19 (AstraZeneca)",
    code: "COVID-AZ",
    manufacturer: "AstraZeneca",
    doses_required: 2,
    interval_days: 84,
    description: "Viral vector vaccine for COVID-19",
    age_min: 18,
    age_max: null,
  },
  {
    name: "Hepatitis B",
    code: "HEP-B",
    manufacturer: "GSK",
    doses_required: 3,
    interval_days: 30,
    description: "Hepatitis B vaccine",
    age_min: 0,
    age_max: null,
  },
  {
    name: "Measles, Mumps, Rubella (MMR)",
    code: "MMR",
    manufacturer: "Merck",
    doses_required: 2,
    interval_days: 28,
    description: "Combined MMR vaccine",
    age_min: 1,
    age_max: null,
  },
  {
    name: "Influenza",
    code: "FLU",
    manufacturer: "Sanofi Pasteur",
    doses_required: 1,
    interval_days: 365,
    description: "Annual flu vaccine",
    age_min: 6,
    age_max: null,
  },
  {
    name: "Tetanus",
    code: "TET",
    manufacturer: "GSK",
    doses_required: 3,
    interval_days: 30,
    description: "Tetanus vaccine",
    age_min: 0,
    age_max: null,
  },
  {
    name: "Polio (IPV)",
    code: "POLIO",
    manufacturer: "Sanofi Pasteur",
    doses_required: 4,
    interval_days: 60,
    description: "Inactivated Poliovirus Vaccine",
    age_min: 0,
    age_max: 18,
  },
];

const facilities = [
  {
    name: "Central Health Clinic",
    address: "123 Main Street, Port Harcourt, Rivers State",
    phone: "+234 803 123 4567",
    email: "central@healthclinic.com",
    capacity: 500,
    type: "clinic",
  },
  {
    name: "General Hospital Port Harcourt",
    address: "45 Hospital Road, Port Harcourt, Rivers State",
    phone: "+234 805 234 5678",
    email: "info@ghph.com",
    capacity: 2000,
    type: "hospital",
  },
  {
    name: "Community Health Center",
    address: "78 Community Avenue, Port Harcourt, Rivers State",
    phone: "+234 807 345 6789",
    email: "contact@chc.com",
    capacity: 300,
    type: "health_center",
  },
];

const healthcareStaff = [
  {
    name: "Dr. Michael Brown",
    email: "michaelbrown@gmail.com",
    password:'123456789',
    phone: "+234 803 456 7890",
    role: "facility admin",
    username: "michaelbrown@gmail.com",
  },
  {
    name: "Dr. Sarah Williams",
    email: "sarah.williams@healthcare.com",
    phone: "+234 805 567 8901",
     password:'123456789',
    role: "facility admin",
    username: "sarah.williams@healthcare.com",
  
  },
  {
    name: "Nurse Emily Davis",
    email: "emily.davis@healthcare.com",
    phone: "+234 807 678 9012",
    role: "facility admin",
    username: "emily.davis@healthcare.com",
      password:'123456789',
    
  },
 
];

const patients = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@email.com",
    phone: "+234 803 111 2222",
    date_of_birth: "1990-05-15",
    gender: "male",
    address: "12 Park Lane, Port Harcourt",
    blood_type: "O+",
    allergies: "None",
  },
  {
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+234 805 222 3333",
    date_of_birth: "1985-08-22",
    gender: "female",
    address: "45 River Road, Port Harcourt",
    blood_type: "A+",
    allergies: "Penicillin",
  },
  {
    first_name: "Michael",
    last_name: "Smith",
    email: "michael.smith@email.com",
    phone: "+234 807 333 4444",
    date_of_birth: "1978-03-10",
    gender: "male",
    address: "78 Garden Street, Port Harcourt",
    blood_type: "B+",
    allergies: "None",
  },
  {
    first_name: "Emma",
    last_name: "Wilson",
    email: "emma.wilson@email.com",
    phone: "+234 809 444 5555",
    date_of_birth: "1995-12-18",
    gender: "female",
    address: "23 Hill Avenue, Port Harcourt",
    blood_type: "AB+",
    allergies: "Latex",
  },
  {
    first_name: "David",
    last_name: "Brown",
    email: "david.brown@email.com",
    phone: "+234 806 555 6666",
    date_of_birth: "1982-07-25",
    gender: "male",
    address: "56 Lake View, Port Harcourt",
    blood_type: "O-",
    allergies: "Eggs",
  },
  {
    first_name: "Lisa",
    last_name: "Anderson",
    email: "lisa.anderson@email.com",
    phone: "+234 808 666 7777",
    date_of_birth: "1992-11-30",
    gender: "female",
    address: "89 Sunset Boulevard, Port Harcourt",
    blood_type: "A-",
    allergies: "None",
  },
  {
    first_name: "James",
    last_name: "Martinez",
    email: "james.martinez@email.com",
    phone: "+234 803 777 8888",
    date_of_birth: "1988-04-05",
    gender: "male",
    address: "34 Beach Road, Port Harcourt",
    blood_type: "B-",
    allergies: "Sulfa drugs",
  },
  {
    first_name: "Jennifer",
    last_name: "Taylor",
    email: "jennifer.taylor@email.com",
    phone: "+234 805 888 9999",
    date_of_birth: "1975-09-12",
    gender: "female",
    address: "67 Mountain Drive, Port Harcourt",
    blood_type: "AB-",
    allergies: "None",
  },
];

async function createTables() {
  console.log("🔨 Creating database tables...\n");

  // Users table
//   await sql`
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       username VARCHAR(100) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       email VARCHAR(255) UNIQUE NOT NULL,
//       role VARCHAR(50) DEFAULT 'user',
//       name VARCHAR(255),
//       status VARCHAR(20) DEFAULT 'active',
//       last_login TIMESTAMP,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

  // Vaccine types table
  await sql`
    CREATE TABLE IF NOT EXISTS vaccine_types (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      manufacturer VARCHAR(255),
      doses_required INTEGER DEFAULT 1,
      interval_days INTEGER,
      description TEXT,
      age_min INTEGER DEFAULT 0,
      age_max INTEGER,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Facilities table
  await sql`
    CREATE TABLE IF NOT EXISTS facilities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT,
      phone VARCHAR(50),
      email VARCHAR(255),
      capacity INTEGER,
      type VARCHAR(50),
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Healthcare staff table
  await sql`
    CREATE TABLE IF NOT EXISTS healthcare_staff (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      role VARCHAR(50),
      license_number VARCHAR(100) UNIQUE,
      specialization VARCHAR(255),
      facility_id INTEGER REFERENCES facilities(id),
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Patients table
//   await sql`
//     CREATE TABLE IF NOT EXISTS patients (
//       id SERIAL PRIMARY KEY,
//       patient_number VARCHAR(50) UNIQUE NOT NULL,
//       first_name VARCHAR(100) NOT NULL,
//       last_name VARCHAR(100) NOT NULL,
//       email VARCHAR(255),
//       phone VARCHAR(50),
//       date_of_birth DATE,
//       gender VARCHAR(20),
//       address TEXT,
//       blood_type VARCHAR(10),
//       allergies TEXT,
//       emergency_contact_name VARCHAR(255),
//       emergency_contact_phone VARCHAR(50),
//       status VARCHAR(20) DEFAULT 'active',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

  // Vaccinations table
//   await sql`
//     CREATE TABLE IF NOT EXISTS vaccinations (
//       id SERIAL PRIMARY KEY,
//       vaccination_number VARCHAR(50) UNIQUE NOT NULL,
//       patient_id INTEGER REFERENCES patients(id),
//       vaccine_type_id INTEGER REFERENCES vaccine_types(id),
//       facility_id INTEGER REFERENCES facilities(id),
//       healthcare_staff_id INTEGER REFERENCES healthcare_staff(id),
//       dose_number INTEGER,
//       vaccination_date TIMESTAMP,
//       next_dose_date DATE,
//       batch_number VARCHAR(100),
//       expiry_date DATE,
//       site VARCHAR(100),
//       route VARCHAR(50),
//       status VARCHAR(50) DEFAULT 'scheduled',
//       notes TEXT,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

  // Appointments table
//   await sql`
//     CREATE TABLE IF NOT EXISTS appointments (
//       id SERIAL PRIMARY KEY,
//       appointment_number VARCHAR(50) UNIQUE NOT NULL,
//       patient_id INTEGER REFERENCES patients(id),
//       vaccine_type_id INTEGER REFERENCES vaccine_types(id),
//       facility_id INTEGER REFERENCES facilities(id),
//       healthcare_staff_id INTEGER REFERENCES healthcare_staff(id),
//       appointment_date TIMESTAMP,
//       status VARCHAR(50) DEFAULT 'scheduled',
//       notes TEXT,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

  // Inventory table
  await sql`
    CREATE TABLE IF NOT EXISTS inventory (
      id SERIAL PRIMARY KEY,
      vaccine_type_id INTEGER REFERENCES vaccine_types(id),
      batch_number VARCHAR(100),
      quantity INTEGER DEFAULT 0,
      expiry_date DATE,
      manufacturer_date DATE,
      storage_condition VARCHAR(100),
      status VARCHAR(20) DEFAULT 'available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  console.log("✅ Tables created successfully\n");
}

// async function seedUsers() {
//   console.log("👥 Seeding users...");

//   const users = [
//     {
//       username: "admin",
//       password: await bcrypt.hash("Admin@123", 10),
//       email: "admin@vaccineapp.com",
//       role: "admin",
//       name: "System Administrator",
//       status: "active",
//     },
//     {
//       username: "doctor1",
//       password: await bcrypt.hash("Doctor@123", 10),
//       email: "doctor1@vaccineapp.com",
//       role: "doctor",
//       name: "Dr. Michael Brown",
//       status: "active",
//     },
//     {
//       username: "nurse1",
//       password: await bcrypt.hash("Nurse@123", 10),
//       email: "nurse1@vaccineapp.com",
//       role: "nurse",
//       name: "Nurse Emily Davis",
//       status: "active",
//     },
//     {
//       username: "receptionist",
//       password: await bcrypt.hash("Reception@123", 10),
//       email: "reception@vaccineapp.com",
//       role: "receptionist",
//       name: "Jane Smith",
//       status: "active",
//     },
//   ];

//   for (const user of users) {
//     await sql`
//       INSERT INTO users (username, password, email, role, name, status)
//       VALUES (${user.username}, ${user.password}, ${user.email}, ${user.role}, ${user.name}, ${user.status})
//       ON CONFLICT (username) DO NOTHING
//     `;
//   }

//   console.log(`✅ Seeded ${users.length} users\n`);
// }

async function seedVaccineTypes() {
  console.log("💉 Seeding vaccine types...");

  for (const vaccine of vaccineTypes) {
    await sql`
      INSERT INTO vaccine_types (
        name, code, manufacturer, doses_required, interval_days, 
        description, age_min, age_max, status
      )
      VALUES (
        ${vaccine.name}, ${vaccine.code}, ${vaccine.manufacturer},
        ${vaccine.doses_required}, ${vaccine.interval_days},
        ${vaccine.description}, ${vaccine.age_min}, ${vaccine.age_max}, 'active'
      )
      ON CONFLICT (code) DO NOTHING
    `;
  }

  console.log(`✅ Seeded ${vaccineTypes.length} vaccine types\n`);
}

async function seedFacilities() {
  console.log("🏥 Seeding facilities...");

  for (const facility of facilities) {
    await sql`
      INSERT INTO facilities (name, address, phone, email, capacity, type, status)
      VALUES (
        ${facility.name}, ${facility.address}, ${facility.phone},
        ${facility.email}, ${facility.capacity}, ${facility.type}, 'active'
      )
    `;
  }

  console.log(`✅ Seeded ${facilities.length} facilities\n`);
}

async function seedHealthcareStaff() {
  console.log("👨‍⚕️ Seeding healthcare staff...");

  // Get facility IDs
  const facilitiesData = await sql`SELECT id FROM facilities`;

  for (let i = 0; i < healthcareStaff.length; i++) {
    const staff = healthcareStaff[i];
    const facilityId = facilitiesData[i % facilitiesData.length].id;
    const passwordHash=await bcrypt.hash(staff.password,10)

    await sql`
      INSERT INTO users (username,password, email, role,name, phone, facility_id, status
      )
      VALUES (
        ${staff.username}, ${passwordHash}, ${staff.email}, ${staff.role},
        ${staff.name}, ${staff.phone}, ${facilityId}, 'active'
      )
      ON CONFLICT (email) DO NOTHING
    `;
  }

  console.log(`✅ Seeded ${healthcareStaff.length} healthcare staff\n`);
}

// async function seedPatients() {
//   console.log("🧑‍⚕️ Seeding patients...");

//   for (let i = 0; i < patients.length; i++) {
//     const patient = patients[i];
//     const patientNumber = `PAT${String(i + 1).padStart(6, '0')}`;

//     await sql`
//       INSERT INTO patients (
//         patient_number, first_name, last_name, email, phone,
//         date_of_birth, gender, address, blood_type, allergies, status
//       )
//       VALUES (
//         ${patientNumber}, ${patient.first_name}, ${patient.last_name},
//         ${patient.email}, ${patient.phone}, ${patient.date_of_birth},
//         ${patient.gender}, ${patient.address}, ${patient.blood_type},
//         ${patient.allergies}, 'active'
//       )
//     `;
//   }

//   console.log(`✅ Seeded ${patients.length} patients\n`);
// }

// async function seedVaccinations() {
//   console.log("💉 Seeding vaccinations...");

//   const patientsData = await sql`SELECT id FROM patients`;
//   const vaccinesData = await sql`SELECT id FROM vaccine_types`;
//   const facilitiesData = await sql`SELECT id FROM facilities`;
//   const staffData = await sql`SELECT id FROM healthcare_staff`;

//   const statuses = ['completed', 'scheduled', 'pending', 'completed', 'completed'];
//   const sites = ['Left arm', 'Right arm', 'Left thigh', 'Right thigh'];
//   const routes = ['Intramuscular', 'Subcutaneous'];

//   for (let i = 0; i < 50; i++) {
//     const vaccinationNumber = `VAC${String(i + 1).padStart(6, '0')}`;
//     const patientId = patientsData[i % patientsData.length].id;
//     const vaccineId = vaccinesData[i % vaccinesData.length].id;
//     const facilityId = facilitiesData[i % facilitiesData.length].id;
//     const staffId = staffData[i % staffData.length].id;
//     const status = statuses[i % statuses.length];
//     const doseNumber = (i % 3) + 1;
    
//     const daysAgo = Math.floor(Math.random() * 30);
//     const vaccinationDate = new Date();
//     vaccinationDate.setDate(vaccinationDate.getDate() - daysAgo);

//     const nextDoseDate = new Date(vaccinationDate);
//     nextDoseDate.setDate(nextDoseDate.getDate() + 30);

//     const expiryDate = new Date();
//     expiryDate.setFullYear(expiryDate.getFullYear() + 2);

//     await sql`
//       INSERT INTO vaccinations (
//         vaccination_number, patient_id, vaccine_type_id, facility_id,
//         healthcare_staff_id, dose_number, vaccination_date, next_dose_date,
//         batch_number, expiry_date, site, route, status
//       )
//       VALUES (
//         ${vaccinationNumber}, ${patientId}, ${vaccineId}, ${facilityId},
//         ${staffId}, ${doseNumber}, ${vaccinationDate.toISOString()},
//         ${nextDoseDate.toISOString().split('T')[0]},
//         ${'BATCH' + String(1000 + i)}, ${expiryDate.toISOString().split('T')[0]},
//         ${sites[i % sites.length]}, ${routes[i % routes.length]}, ${status}
//       )
//     `;
//   }

//   console.log("✅ Seeded 50 vaccinations\n");
// }

// async function seedAppointments() {
//   console.log("📅 Seeding appointments...");

//   const patientsData = await sql`SELECT id FROM patients`;
//   const vaccinesData = await sql`SELECT id FROM vaccine_types`;
//   const facilitiesData = await sql`SELECT id FROM facilities`;
//   const staffData = await sql`SELECT id FROM healthcare_staff`;

//   const statuses = ['scheduled', 'confirmed', 'pending', 'cancelled', 'completed'];

//   for (let i = 0; i < 30; i++) {
//     const appointmentNumber = `APT${String(i + 1).padStart(6, '0')}`;
//     const patientId = patientsData[i % patientsData.length].id;
//     const vaccineId = vaccinesData[i % vaccinesData.length].id;
//     const facilityId = facilitiesData[i % facilitiesData.length].id;
//     const staffId = staffData[i % staffData.length].id;
//     const status = statuses[i % statuses.length];
    
//     const appointmentDate = new Date();
//     appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30));

//     await sql`
//       INSERT INTO appointments (
//         appointment_number, patient_id, vaccine_type_id, facility_id,
//         healthcare_staff_id, appointment_date, status
//       )
//       VALUES (
//         ${appointmentNumber}, ${patientId}, ${vaccineId}, ${facilityId},
//         ${staffId}, ${appointmentDate.toISOString()}, ${status}
//       )
//     `;
//   }

//   console.log("✅ Seeded 30 appointments\n");
// }

async function seedInventory() {
  console.log("📦 Seeding inventory...");

  const vaccinesData = await sql`SELECT id FROM vaccine_types`;
  const facilitiesData = await sql`SELECT id FROM facilities`;

  for (let i = 0; i < vaccinesData.length; i++) {
    for (let j = 0; j < facilitiesData.length; j++) {
      const vaccineId = vaccinesData[i].id;
      const facilityId = facilitiesData[j].id;
      const quantity = Math.floor(Math.random() * 1000) + 100;
      
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 12));

      const manufacturerDate = new Date();
      manufacturerDate.setMonth(manufacturerDate.getMonth() - 3);

      await sql`
        INSERT INTO inventory (
          vaccine_type_id, facility_id, batch_number, quantity,
          expiry_date, manufacturer_date, storage_condition, status
        )
        VALUES (
          ${vaccineId}, ${facilityId}, ${'BATCH' + String(2000 + i * 3 + j)},
          ${quantity}, ${expiryDate.toISOString().split('T')[0]},
          ${manufacturerDate.toISOString().split('T')[0]},
          '2-8°C refrigerated', 'available'
        )
      `;
    }
  }

  console.log(`✅ Seeded ${vaccinesData.length * facilitiesData.length} inventory items\n`);
}

async function seed() {
  try {
    console.log("🌱 Starting VaccineApp database seeding...\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    await createTables();
    // await seedUsers();
    await seedVaccineTypes();
    await seedFacilities();
    await seedHealthcareStaff();
    // await seedPatients();
    // await seedVaccinations();
    // await seedAppointments();
    await seedInventory();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🎉 Database seeding completed successfully!\n");
    console.log("📋 Summary:");
    console.log("  • 4 users");
    console.log("  • 8 vaccine types");
    console.log("  • 3 facilities");
    console.log("  • 5 healthcare staff");
    console.log("  • 8 patients");
    console.log("  • 50 vaccinations");
    console.log("  • 30 appointments");
    console.log("  • 24 inventory items\n");
    
    console.log("🔐 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:        admin / Admin@123");
    console.log("Doctor:       doctor1 / Doctor@123");
    console.log("Nurse:        nurse1 / Nurse@123");
    console.log("Receptionist: receptionist / Reception@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the seed function
seed();