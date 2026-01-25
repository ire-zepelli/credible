export const AdminInitialData = {
  credentials: [
    {
      id: 1001,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      title: 'Licensed Civil Engineer',
      description: 'Professional civil engineer with 5 years of experience in structural design and project management.',
      status: 'pending',
      files: ['credential_1_1.jpg', 'credential_1_2.jpg']
    },
    {
      id: 1002,
      name: 'Juan Dela Cruz',
      email: 'juan.dc@email.com',
      title: 'Certified Public Accountant',
      description: 'CPA with expertise in tax compliance and financial auditing.',
      status: 'pending',
      files: ['credential_2_1.jpg', 'credential_2_2.jpg']
    }
  ],
  transactions: [
    {
      id: 2001,
      name: 'Anna Reyes',
      email: 'anna.reyes@email.com',
      title: 'Residential Property Sale',
      description: 'Sale of 3-bedroom house with 2-car garage to ABC Corporation.',
      clientName: 'ABC Corporation',
      propertyType: '3BR House with Garage',
      status: 'pending',
      files: ['transaction_1_receipt.jpg', 'transaction_1_delivery.jpg']
    },
    {
      id: 2002,
      name: 'Carlos Martinez',
      email: 'carlos.m@email.com',
      title: 'Commercial Property Transaction',
      description: 'Provided commercial warehouse space lease to XYZ Company.',
      clientName: 'XYZ Company',
      propertyType: 'Commercial Warehouse',
      status: 'pending',
      files: ['transaction_2_contract.jpg', 'transaction_2_invoice.jpg']
    }
  ],
  licenses: [
    {
      id: 3001,
      name: 'Patricia Gomez',
      email: 'patricia.g@email.com',
      licenseType: "Driver's License",
      expiryDate: '2026-12-31',
      status: 'pending',
      files: ['license_3001_front.jpg', 'license_3001_back.jpg']
    },
    {
      id: 3002,
      name: 'Roberto Cruz',
      email: 'roberto.cruz@email.com',
      licenseType: 'Professional ID',
      expiryDate: '2027-06-15',
      status: 'pending',
      files: ['license_3002_front.jpg', 'license_3002_back.jpg']
    }
  ],
  reports: [
    {
      id: 4001,
      name: 'Lisa Torres',
      email: 'lisa.torres@email.com',
      title: 'Suspicious Activity Report',
      description: 'Observed unauthorized access attempts to company database on January 20, 2026. Multiple failed login attempts detected.',
      reporterId: 'EMP-4521',
      status: 'pending',
      files: ['report_4001_screenshot.jpg', 'report_4001_logs.jpg']
    },
    {
      id: 4002,
      name: 'Miguel Ramirez',
      email: 'miguel.r@email.com',
      title: 'Safety Violation Report',
      description: 'Safety equipment not properly maintained in warehouse area. Immediate attention required.',
      reporterId: 'EMP-7823',
      status: 'pending',
      files: ['report_4002_photo1.jpg', 'report_4002_photo2.jpg']
    }
  ]
};