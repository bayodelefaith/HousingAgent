import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.models.agent import Agent
from app.core.security import get_password_hash

def seed_agent():
    db = SessionLocal()
    try:
        agent_email = "agent@luxehousing.com"
        existing_user = db.query(User).filter(User.email == agent_email).first()
        
        if existing_user:
            # Upgrade existing user
            existing_user.is_agent = True
            
            # Create or update agent profile
            agent = db.query(Agent).filter(Agent.user_id == existing_user.id).first()
            if not agent:
                agent = Agent(
                    user_id=existing_user.id,
                    nin="99988877766",
                    phone_number="+2349000000000",
                    verification_level=2,
                    is_verified=True
                )
                db.add(agent)
            else:
                agent.verification_level = 2
                agent.is_verified = True
                agent.nin = "99988877766"
                agent.phone_number = "+2349000000000"
                
            db.commit()
            print(f"Updated existing user {agent_email} to be a verified agent.")
            return

        # Create new agent user
        new_user = User(
            email=agent_email,
            hashed_password=get_password_hash("AgentPassword123!"),
            is_active=True,
            is_agent=True,
            is_admin=False
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Create verified Agent profile
        new_agent = Agent(
            user_id=new_user.id,
            nin="99988877766",
            phone_number="+2349000000000",
            verification_level=2,
            is_verified=True
        )
        db.add(new_agent)
        db.commit()
        
        print(f"Successfully created verified agent: {agent_email} with password: AgentPassword123!")

    except Exception as e:
        print(f"Error seeding agent: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_agent()
