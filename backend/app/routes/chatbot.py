from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import re

chatbot_bp = Blueprint('chatbot', __name__)

# Pregnancy knowledge base
PREGNANCY_KNOWLEDGE = {
    'symptoms': {
        'morning_sickness': "Morning sickness is common in the first trimester. Try eating small, frequent meals and staying hydrated. Ginger tea can help. If severe, consult your doctor.",
        'fatigue': "Fatigue is normal during pregnancy, especially in the first and third trimesters. Rest when you can, maintain a healthy diet, and stay active with light exercise.",
        'back_pain': "Back pain is common as your body adjusts to carrying extra weight. Use proper posture, wear supportive shoes, and consider prenatal yoga or swimming.",
        'headache': "Headaches can occur due to hormonal changes, dehydration, or stress. Stay hydrated, rest in a dark room, and avoid triggers. Consult your doctor if severe.",
        'swelling': "Mild swelling in feet and ankles is normal. Elevate your legs, stay hydrated, and avoid standing for long periods. Sudden severe swelling needs immediate medical attention."
    },
    'nutrition': {
        'foods_to_eat': "Focus on: leafy greens, lean proteins, whole grains, fruits, dairy products, eggs, and fish low in mercury. Take prenatal vitamins as prescribed.",
        'foods_to_avoid': "Avoid: raw fish/meat, unpasteurized dairy, high-mercury fish, excess caffeine, alcohol, raw eggs, and unwashed produce.",
        'supplements': "Essential supplements include folic acid (400-800mcg), iron, calcium, vitamin D, and DHA omega-3. Always consult your doctor before taking any supplements."
    },
    'exercise': {
        'safe_exercises': "Safe exercises include walking, swimming, prenatal yoga, stationary cycling, and low-impact aerobics. Always warm up and stay hydrated.",
        'exercises_to_avoid': "Avoid contact sports, activities with fall risk, exercises lying flat on back (after first trimester), heavy lifting, and high-altitude activities."
    },
    'trimester_info': {
        'first': "First trimester (weeks 1-12): Baby's major organs form. You may experience nausea, fatigue, and breast tenderness. Regular prenatal visits begin.",
        'second': "Second trimester (weeks 13-26): Baby grows rapidly. You'll feel movement around week 20. Energy typically improves. Anatomy scan usually at week 20.",
        'third': "Third trimester (weeks 27-40): Baby gains weight and prepares for birth. You may feel Braxton Hicks contractions. Prepare for labor and delivery."
    },
    'warning_signs': {
        'emergency': "Seek immediate care for: heavy bleeding, severe abdominal pain, severe headache with vision changes, water breaking before 37 weeks, decreased fetal movement, or fever over 101°F."
    }
}

def get_chatbot_response(message):
    """Generate response based on user message"""
    message_lower = message.lower()
    
    # Greetings
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good evening']):
        return "Hello! I'm PregAI, your pregnancy health assistant. How can I help you today? You can ask me about symptoms, nutrition, exercise, or any pregnancy-related concerns."
    
    # Symptoms
    if any(word in message_lower for word in ['nausea', 'vomit', 'morning sickness', 'sick']):
        return PREGNANCY_KNOWLEDGE['symptoms']['morning_sickness']
    
    if any(word in message_lower for word in ['tired', 'fatigue', 'exhausted', 'sleepy']):
        return PREGNANCY_KNOWLEDGE['symptoms']['fatigue']
    
    if any(word in message_lower for word in ['back pain', 'backache', 'back hurts']):
        return PREGNANCY_KNOWLEDGE['symptoms']['back_pain']
    
    if any(word in message_lower for word in ['headache', 'head pain', 'migraine']):
        return PREGNANCY_KNOWLEDGE['symptoms']['headache']
    
    if any(word in message_lower for word in ['swelling', 'swollen', 'edema']):
        return PREGNANCY_KNOWLEDGE['symptoms']['swelling']
    
    # Nutrition
    if any(word in message_lower for word in ['eat', 'food', 'diet', 'nutrition', 'what to eat']):
        if any(word in message_lower for word in ['avoid', 'not', "don't", 'harmful']):
            return PREGNANCY_KNOWLEDGE['nutrition']['foods_to_avoid']
        return PREGNANCY_KNOWLEDGE['nutrition']['foods_to_eat']
    
    if any(word in message_lower for word in ['vitamin', 'supplement', 'folic', 'iron']):
        return PREGNANCY_KNOWLEDGE['nutrition']['supplements']
    
    # Exercise
    if any(word in message_lower for word in ['exercise', 'workout', 'physical activity', 'yoga', 'swimming']):
        if any(word in message_lower for word in ['avoid', 'not', "don't", 'unsafe']):
            return PREGNANCY_KNOWLEDGE['exercise']['exercises_to_avoid']
        return PREGNANCY_KNOWLEDGE['exercise']['safe_exercises']
    
    # Trimester info
    if 'first trimester' in message_lower or 'trimester 1' in message_lower:
        return PREGNANCY_KNOWLEDGE['trimester_info']['first']
    
    if 'second trimester' in message_lower or 'trimester 2' in message_lower:
        return PREGNANCY_KNOWLEDGE['trimester_info']['second']
    
    if 'third trimester' in message_lower or 'trimester 3' in message_lower:
        return PREGNANCY_KNOWLEDGE['trimester_info']['third']
    
    if 'trimester' in message_lower:
        return f"{PREGNANCY_KNOWLEDGE['trimester_info']['first']}\n\n{PREGNANCY_KNOWLEDGE['trimester_info']['second']}\n\n{PREGNANCY_KNOWLEDGE['trimester_info']['third']}"
    
    # Warning signs
    if any(word in message_lower for word in ['emergency', 'warning', 'danger', 'bleeding', 'severe pain', 'hospital']):
        return PREGNANCY_KNOWLEDGE['warning_signs']['emergency']
    
    # Baby development questions
    if any(word in message_lower for word in ['baby', 'fetus', 'development', 'growing']):
        return "Your baby goes through amazing changes each week! During the first trimester, major organs form. In the second trimester, your baby grows rapidly and you'll feel movements. In the third trimester, baby gains weight and prepares for birth. Would you like specific information about a particular week or trimester?"
    
    # Due date
    if any(word in message_lower for word in ['due date', 'delivery date', 'when will baby']):
        return "Your due date is calculated as 40 weeks from the first day of your last menstrual period. However, only about 5% of babies arrive on their exact due date. Most babies are born within 2 weeks before or after. Your doctor will monitor your progress and may adjust the date based on ultrasounds."
    
    # Default response
    return "I understand you're asking about pregnancy. Could you please be more specific? I can help with:\n\n• Pregnancy symptoms and how to manage them\n• Nutrition and foods to eat or avoid\n• Safe exercises during pregnancy\n• Trimester-by-trimester information\n• Warning signs to watch for\n\nWhat would you like to know more about?"

@chatbot_bp.route('/message', methods=['POST'])
@jwt_required()
def chat():
    """Handle chatbot message"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Please enter a message'}), 400
        
        response = get_chatbot_response(message)
        
        return jsonify({
            'response': response,
            'suggestions': [
                "What foods should I eat?",
                "What are safe exercises?",
                "Tell me about first trimester",
                "What are warning signs?"
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chatbot_bp.route('/suggestions', methods=['GET'])
@jwt_required()
def get_suggestions():
    """Get chat suggestions"""
    return jsonify({
        'suggestions': [
            "How to manage morning sickness?",
            "What foods should I avoid?",
            "Safe exercises during pregnancy",
            "What to expect in second trimester?",
            "When should I call the doctor?"
        ]
    }), 200
