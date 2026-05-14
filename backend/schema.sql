-- Minimal Database Schema for Employee Performance Platform
-- PostgreSQL

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(100),
    department VARCHAR(100),
    manager_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    review_period VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Skills table
CREATE TABLE employee_skills (
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,

    proficiency_level VARCHAR(50)
    CHECK (
        proficiency_level IN
        ('Beginner', 'Intermediate', 'Advanced', 'Expert')
    ),

    PRIMARY KEY (employee_id, skill_id)
);

-- Development Plans
CREATE TABLE development_plans (
    id SERIAL PRIMARY KEY,

    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,

    goal TEXT NOT NULL,

    status VARCHAR(50) DEFAULT 'Pending',

    target_date DATE,

    progress_percentage INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training Records
CREATE TABLE training_records (
    id SERIAL PRIMARY KEY,

    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,

    course_name VARCHAR(255) NOT NULL,

    provider VARCHAR(255),

    completed_at DATE,

    certification_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_reviews_employee ON reviews(employee_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_skills_name
ON skills(name);

CREATE INDEX idx_employee_skills_employee
ON employee_skills(employee_id);

CREATE INDEX idx_employee_skills_skill
ON employee_skills(skill_id);

CREATE INDEX idx_development_employee
ON development_plans(employee_id);

CREATE INDEX idx_training_employee
ON training_records(employee_id);