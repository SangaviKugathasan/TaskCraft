#!/usr/bin/env python
"""
Script to create PostgreSQL database for TaskCraft
Run this script to create the database and tables
"""
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskcraft.settings')
django.setup()

def create_database():
    """Create the PostgreSQL database"""
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    
    # Database connection parameters
    db_params = {
        'host': 'localhost',
        'port': '5432',
        'user': 'postgres',
        'password': 'Sangavi139*'
    }
    
    # Database name
    db_name = 'todo_db'
    
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(**db_params)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_name,))
        exists = cursor.fetchone()
        
        if not exists:
            # Create database
            cursor.execute(f'CREATE DATABASE "{db_name}"')
            print(f"✅ Database '{db_name}' created successfully!")
        else:
            print(f"✅ Database '{db_name}' already exists!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False
    
    return True

def run_migrations():
    """Run Django migrations"""
    try:
        print("🔄 Running migrations...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations completed successfully!")
        return True
    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return False

def create_superuser():
    """Create a superuser for admin access"""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@taskcraft.com', 'admin123')
            print("✅ Superuser 'admin' created successfully!")
            print("   Username: admin")
            print("   Password: admin123")
        else:
            print("✅ Superuser 'admin' already exists!")
        
        return True
    except Exception as e:
        print(f"❌ Error creating superuser: {e}")
        return False

if __name__ == '__main__':
    print("🚀 Setting up TaskCraft PostgreSQL Database...")
    print("=" * 50)
    
    # Step 1: Create database
    if not create_database():
        print("❌ Failed to create database. Exiting.")
        sys.exit(1)
    
    # Step 2: Run migrations
    if not run_migrations():
        print("❌ Failed to run migrations. Exiting.")
        sys.exit(1)
    
    # Step 3: Create superuser
    if not create_superuser():
        print("❌ Failed to create superuser. Exiting.")
        sys.exit(1)
    
    print("=" * 50)
    print("🎉 TaskCraft database setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend server: python manage.py runserver 0.0.0.0:8000")
    print("2. Access admin panel: http://localhost:8000/admin/")
    print("3. Start the frontend: cd ../frontend && npm run dev")
    print("4. Access the app: http://localhost:5173")
