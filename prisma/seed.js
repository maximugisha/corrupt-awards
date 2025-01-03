import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();


async function main() {
    // Check if essential tables are empty (districts, institutions, users, etc.)
    const districtCount = await prisma.district.count();
    const institutionCount = await prisma.institution.count();
    const userCount = await prisma.user.count();

    if (districtCount > 0 || institutionCount > 0 || userCount > 0) {
        console.log("Database is not empty. Skipping seeding.");
        return; // Exit if database is not empty
    }

    console.log("Database is empty. Proceeding with seeding...");
    // Seed Districts
    const districts = await Promise.all(
        [
            { name: 'Kampala', region: 'Central' },
            { name: 'Gulu', region: 'Northern' },
            { name: 'Mbarara', region: 'Western' },
            { name: 'Mbale', region: 'Eastern' },
            { name: 'Jinja', region: 'Eastern' },
        ].map((district) =>
            prisma.district.create({
                data: district,
            })
        )
    );

    // Seed Institutions
    const institutions = await Promise.all(
        [
            { name: 'Makerere University' },
            { name: 'Mulago Hospital' },
            { name: 'Bank of Uganda' },
            { name: 'Uganda Revenue Authority' },
            { name: 'KCCA' },
        ].map((institution) =>
            prisma.institution.create({
                data: institution,
            })
        )
    );

    // Seed Positions
    const positions = await Promise.all(
        ['Cabinet Secretary', 'Minister', 'Mayor', 'County Governor', 'Managing Director'].map((name) =>
            prisma.position.create({
                data: { name },
            })
        )
    );

    // Seed Users
    const users = await Promise.all(
        [
            { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
            { name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
            { name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123' },
            { name: 'Diana Prince', email: 'diana@example.com', password: 'password123' },
            { name: 'Eve Adams', email: 'eve@example.com', password: 'password123' },
        ].map((user) =>
            prisma.user.create({
                data: user,
            })
        )
    );

    // Seed Nominees
    const nominees = await Promise.all(
        [
            { name: 'John Doe', positionId: faker.helpers.arrayElement(positions).id, institutionId: faker.helpers.arrayElement(institutions).id, districtId: faker.helpers.arrayElement(districts).id, status: true },
            { name: 'Jane Smith', positionId: faker.helpers.arrayElement(positions).id, institutionId: faker.helpers.arrayElement(institutions).id, districtId: faker.helpers.arrayElement(districts).id, status: false },
            { name: 'Paul Johnson', positionId: faker.helpers.arrayElement(positions).id, institutionId: faker.helpers.arrayElement(institutions).id, districtId: faker.helpers.arrayElement(districts).id, status: true },
            { name: 'Emily Davis', positionId: faker.helpers.arrayElement(positions).id, institutionId: faker.helpers.arrayElement(institutions).id, districtId: faker.helpers.arrayElement(districts).id, status: false },
            { name: 'Michael Brown', positionId: faker.helpers.arrayElement(positions).id, institutionId: faker.helpers.arrayElement(institutions).id, districtId: faker.helpers.arrayElement(districts).id, status: true },
        ].map((nominee) =>
            prisma.nominee.create({
                data: nominee,
            })
        )
    );

    // Seed Departments
    const departments = await Promise.all(
        [
            { name: 'Finance' },
            { name: 'Health' },
            { name: 'Legal' },
            { name: 'Licensing' },
            { name: 'Procurement' },
            { name: 'Public Services' },
            { name: 'Human Resources' },
            { name: 'Revenue' },
            { name: 'Treasury' },
            { name: 'Public Finance' },
            { name: 'Service Delivery' },
            { name: 'Administration' },
            { name: 'Urban Planning' },
            { name: 'Social Services' },
            { name: 'Development Projects' },
            { name: 'Resource Allocation' },
            { name: 'Decision Making' },
            { name: 'Policy' },
        ].map((department) =>
            prisma.department.create({
                data: department,
            })
        )
    );

    // Seed Impact Areas
    const impactAreas = await Promise.all(
        [
            { name: 'Finance' },
            { name: 'Health' },
            { name: 'Legal' },
            { name: 'Licensing' },
            { name: 'Procurement' },
            { name: 'Public Services' },
            { name: 'Human Resources' },
            { name: 'Revenue' },
            { name: 'Treasury' },
            { name: 'Public Finance' },
            { name: 'Service Delivery' },
            { name: 'Administration' },
            { name: 'Urban Planning' },
            { name: 'Social Services' },
            { name: 'Development Projects' },
            { name: 'Resource Allocation' },
            { name: 'Decision Making' },
            { name: 'Policy' },
        ].map((area) =>
            prisma.impactArea.create({
                data: area,
            })
        )
    );

    // Seed Institution Rating Categories
    const institutionRatingCategories = await Promise.all(
        [
            {
                keyword: "prevalence-of-bribery",
                name: "Prevalence of Bribery",
                icon: "💰",
                description: "Systematic occurrence of bribery",
                weight: 5,
                examples: [
                    "Widespread bribe collection",
                    "Systematic corruption",
                    "Regular illegal payments"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "extent-of-embezzlement",
                name: "Extent of Embezzlement",
                icon: "🏦",
                description: "Scale of funds misappropriation",
                weight: 5,
                examples: [
                    "Systemic fund diversion",
                    "Resource misappropriation",
                    "Financial misconduct"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "incidence-of-nepotism",
                name: "Incidence of Nepotism",
                icon: "👥",
                description: "Systematic favoritism of relatives",
                weight: 4,
                examples: [
                    "Family-based hiring",
                    "Relative favoritism",
                    "Nepotistic practices"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "frequency-of-fraud",
                name: "Frequency of Fraud",
                icon: "🎭",
                description: "Occurrence of fraudulent activities",
                weight: 5,
                examples: [
                    "Document falsification",
                    "False claims",
                    "Procurement manipulation"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "level-of-conflict",
                name: "Level of Conflict of Interest",
                icon: "⚖️",
                description: "Extent of conflicts of interest",
                weight: 4,
                examples: [
                    "Business conflicts",
                    "Personal interests",
                    "Decision bias"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "transparency-level",
                name: "Transparency of Operations",
                icon: "👁️",
                description: "Level of operational transparency",
                weight: 4,
                examples: [
                    "Information access",
                    "Process clarity",
                    "Decision transparency"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "abuse-of-authority",
                name: "Abuse of Authority",
                icon: "👊",
                description: "Institutional misuse of power",
                weight: 5,
                examples: [
                    "Power misuse",
                    "Authority abuse",
                    "Resource misappropriation"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "degree-of-cronyism",
                name: "Degree of Cronyism",
                icon: "🤝",
                description: "Extent of favoritism practices",
                weight: 4,
                examples: [
                    "Friend favoritism",
                    "Biased appointments",
                    "Unfair advantages"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "unexplained-wealth-officials",
                name: "Unexplained Wealth among Officials",
                icon: "💎",
                description: "Officials' unexplained wealth",
                weight: 4,
                examples: [
                    "Suspicious assets",
                    "Unexplained riches",
                    "Wealth discrepancies"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: "corruption-responsiveness",
                name: "Responsiveness to Corruption",
                icon: "⚡",
                description: "Response to corruption reports",
                weight: 3,
                examples: [
                    "Report handling",
                    "Investigation speed",
                    "Action effectiveness"
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            }
        ].map((institutioncategory) =>
            prisma.institutionRatingCategory.create({
                data: institutioncategory,
            })
        )
    );

    // Seed Rating Categories
    const ratingCategories = await Promise.all(
        [
            {
                keyword: 'bribery',
                name: 'Bribery', icon: '💰',
                description: 'Taking or soliciting bribes for services or favors',
                weight: 5,
                examples: ['Demanding payment for government services',
                    'Accepting kickbacks from contractors',
                    'Bribes for tender awards'],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: 'embezzlement',
                name: 'Embezzlement',
                icon: '🏦',
                description: 'Theft or misappropriation of public funds',
                weight: 4, examples: ['Missing public funds',
                    'Unauthorized use of resources',
                    'Fraudulent claims'],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }

            },
            {
                keyword: 'nepotism',
                name: 'Nepotism',
                icon: '👥',
                description: 'Favoring relatives in appointments and contracts',
                weight: 3,
                examples: ['Hiring family members',
                    'Awarding contracts to relatives',
                    'Creating positions for friends'],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: 'fraud',
                name: 'Fraud',
                icon: '📄',
                description: 'Deceptive practices for personal gain',
                weight: 13,
                examples: [
                    'Procurement fraud',
                    'False documentation',
                    'Inflated contracts'
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: 'conflict',
                name: 'Conflict of Interest',
                icon: '⚖️',
                description: 'Using public office for private benefit',
                weight: 8,
                examples: [
                    'Hidden business interests',
                    'Personal benefit from decisions',
                    'Unfair advantages'
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: 'transparency',
                name: 'Lack of Transparency',
                icon: '🔍',
                description: 'Concealing information from the public',
                weight: 7,
                examples: [
                    'Hidden records',
                    'Secret decisions',
                    'Blocked information access'
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: 'abuse',
                name: 'Abuse of Power',
                icon: '👊',
                description: 'Misusing official position and authority',
                weight: 12,
                examples: [
                    'Intimidation',
                    'Misuse of resources',
                    'Abuse of authority'
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: 'cronyism',
                name: 'Cronyism',
                icon: '🤝',
                description: 'Favoring friends and associates',
                weight: 8,
                examples: [
                    'Political appointments',
                    'Biased contract awards',
                    'Favorable treatment'
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: 'wealth',
                name: 'Unexplained Wealth',
                icon: '💎',
                description: 'Assets and lifestyle beyond known income',
                weight: 10,
                examples: [
                    'Luxury properties',
                    'Unexplained assets',
                    'Hidden wealth'
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            },
            {
                keyword: 'neglect',
                name: 'Neglect of Duty',
                icon: '⚡',
                description: 'Failing to perform official responsibilities',
                weight: 5,
                examples: [
                    'Absenteeism',
                    'Project delays',
                    'Service delivery failure'
                ],
                impactAreas: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(impactAreas).id,
                    })),
                },
                departments: {
                    connect: Array.from({ length: 4 }, () => ({
                        id: faker.helpers.arrayElement(departments).id,
                    })),
                }
            }
        ].map((category) =>
            prisma.ratingCategory.create({
                data: category,
            })
        )
    );

    // Seed Nominee Ratings
    await Promise.all(
        [
            { userId: faker.helpers.arrayElement(users).id, nomineeId: faker.helpers.arrayElement(nominees).id, ratingCategoryId: faker.helpers.arrayElement(ratingCategories).id, score: faker.number.float({ min: 1, max: 5 }), severity: faker.number.float({ min: 1, max: 5 }), evidence: 'Poor performance' },
            { userId: faker.helpers.arrayElement(users).id, nomineeId: faker.helpers.arrayElement(nominees).id, ratingCategoryId: faker.helpers.arrayElement(ratingCategories).id, score: faker.number.float({ min: 1, max: 5 }), severity: faker.number.float({ min: 1, max: 5 }), evidence: 'Bad performance' },
            { userId: faker.helpers.arrayElement(users).id, nomineeId: faker.helpers.arrayElement(nominees).id, ratingCategoryId: faker.helpers.arrayElement(ratingCategories).id, score: faker.number.float({ min: 1, max: 5 }), severity: faker.number.float({ min: 1, max: 5 }), evidence: 'Needs improvement' },
        ].map((rating) =>
            prisma.nomineeRating.create({
                data: rating,
            })
        )
    );

    // Seed Institution Ratings
    await Promise.all(
        [
            { userId: faker.helpers.arrayElement(users).id, institutionId: faker.helpers.arrayElement(institutions).id, ratingCategoryId: faker.helpers.arrayElement(institutionRatingCategories).id, score: faker.number.float({ min: 1, max: 5 }), severity: faker.number.float({ min: 1, max: 5 }), evidence: 'Un Reliable service' },
            { userId: faker.helpers.arrayElement(users).id, institutionId: faker.helpers.arrayElement(institutions).id, ratingCategoryId: faker.helpers.arrayElement(institutionRatingCategories).id, score: faker.number.float({ min: 1, max: 5 }), severity: faker.number.float({ min: 1, max: 5 }), evidence: 'InExcellent performance' },
        ].map((rating) =>
            prisma.institutionRating.create({
                data: rating,
            })
        )
    );

    console.log('Database seeded successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
