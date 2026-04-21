const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { askAI } = require('../services/groq');
const User = require('../models/User');
const Expense = require('../models/Expense');

// AI Suggestion - Analyzes expense and categorizes automatically
router.post('/suggest', auth, async (req, res) => {
  try {
    const { title, amount, category, purpose } = req.body;

    const user = await User.findById(req.user.id);
    const expenses = await Expense.find({ user_id: req.user.id });

    // Calculate current spending
    const productive_spent = expenses
      .filter(e => e.type === 'productive')
      .reduce((sum, e) => sum + e.amount, 0);

    const unproductive_spent = expenses
      .filter(e => e.type === 'unproductive')
      .reduce((sum, e) => sum + e.amount, 0);

    const savings_spent = expenses
      .filter(e => e.type === 'savings')
      .reduce((sum, e) => sum + e.amount, 0);

    const productive_limit = user.income * (user.productive_ratio / 100);
    const unproductive_limit = user.income * (user.unproductive_ratio / 100);
    const savings_target = user.income * (user.savings_ratio / 100);

    // Build AI prompt - AI decides the type
    const prompt = `You are a financial advisor AI. Analyze this expense and provide recommendations.

USER FINANCIAL DATA:
- Monthly Income: ₹${user.income}
- Productive Budget: ₹${productive_limit} (Already spent: ₹${productive_spent}, Remaining: ₹${productive_limit - productive_spent})
- Unproductive Budget: ₹${unproductive_limit} (Already spent: ₹${unproductive_spent}, Remaining: ₹${unproductive_limit - unproductive_spent})
- Savings Target: ₹${savings_target} (Already saved: ₹${savings_spent}, Remaining: ₹${savings_target - savings_spent})

EXPENSE TO ANALYZE:
- Title: ${title}
- Amount: ₹${amount}
- Category: ${category}
- Purpose: ${purpose}

INSTRUCTIONS:
1. First, categorize this expense as one of:
   - "productive" (essential, growth-oriented: education, health, work tools, bills, groceries, transportation for work)
   - "unproductive" (discretionary, entertainment: shopping for pleasure, dining out, gaming, luxury items)
   - "savings" (investments, emergency fund, future goals)

2. Check if this expense fits within the appropriate budget category

3. Decide: Should the user proceed with this expense? (YES or NO)

4. Provide a clear, helpful reason explaining:
   - Why you categorized it this way
   - Whether it fits their budget
   - Impact on their financial goals

5. If NO, suggest alternatives or better timing

RESPOND IN THIS EXACT FORMAT:
TYPE: [productive/unproductive/savings]
DECISION: [YES/NO]
REASON: [Your detailed explanation in 2-3 sentences]
SUGGESTION: [Alternative advice or encouragement]`;

    const aiResponse = await askAI(prompt);
    console.log('Raw AI Response:', aiResponse);

    // Enhanced parsing with fallbacks
    const parseAIResponse = (response) => {
      // Try to extract TYPE
      const typeMatch = response.match(/TYPE:\s*(productive|unproductive|savings)/i);
      let suggestedType = typeMatch ? typeMatch[1].toLowerCase() : null;
      
      // Fallback: Check for keywords if TYPE not found
      if (!suggestedType) {
        if (/\b(education|health|work|essential|bills|groceries|productive)\b/i.test(response)) {
          suggestedType = 'productive';
        } else if (/\b(entertainment|luxury|discretionary|unproductive|gaming|shopping)\b/i.test(response)) {
          suggestedType = 'unproductive';
        } else if (/\b(savings|investment|emergency fund)\b/i.test(response)) {
          suggestedType = 'savings';
        } else {
          suggestedType = 'productive'; // Default fallback
        }
      }

      // Try to extract DECISION
      const decisionMatch = response.match(/DECISION:\s*(YES|NO)/i);
      let decision = decisionMatch ? decisionMatch[1].toUpperCase() : null;
      
      // Fallback: Check for keywords if DECISION not found
      if (!decision) {
        if (/\b(recommend|approve|go ahead|good|fits|within budget)\b/i.test(response)) {
          decision = 'YES';
        } else if (/\b(not recommend|exceed|over budget|wait|postpone)\b/i.test(response)) {
          decision = 'NO';
        } else {
          decision = 'YES'; // Default fallback
        }
      }

      // Try to extract REASON
      const reasonMatch = response.match(/REASON:\s*(.+?)(?=SUGGESTION:|$)/is);
      let reason = reasonMatch ? reasonMatch[1].trim() : '';
      
      // Fallback: Use full response if REASON not found
      if (!reason || reason.length < 20) {
        // Remove TYPE and DECISION lines, keep the rest
        reason = response
          .replace(/TYPE:\s*(productive|unproductive|savings)/i, '')
          .replace(/DECISION:\s*(YES|NO)/i, '')
          .replace(/SUGGESTION:\s*.+$/is, '')
          .trim();
        
        // If still too short, use full response
        if (reason.length < 20) {
          reason = response;
        }
      }

      // Try to extract SUGGESTION
      const suggestionMatch = response.match(/SUGGESTION:\s*(.+?)$/is);
      let suggestion = suggestionMatch ? suggestionMatch[1].trim() : '';
      
      // Fallback: Generate suggestion based on decision
      if (!suggestion || suggestion.length < 10) {
        if (decision === 'YES') {
          suggestion = 'This expense aligns with your financial goals. Proceed with confidence!';
        } else {
          suggestion = 'Consider reviewing your budget or postponing this expense to maintain financial health.';
        }
      }

      return {
        suggestedType,
        decision,
        reason,
        suggestion
      };
    };

    const parsed = parseAIResponse(aiResponse);
    const { suggestedType, decision, reason, suggestion } = parsed;

    console.log('Parsed AI Response:', parsed);

    // Calculate budget impact based on AI's categorization
    let currentSpent, budgetLimit, afterExpense;
    
    if (suggestedType === 'productive') {
      currentSpent = productive_spent;
      budgetLimit = productive_limit;
    } else if (suggestedType === 'unproductive') {
      currentSpent = unproductive_spent;
      budgetLimit = unproductive_limit;
    } else {
      currentSpent = savings_spent;
      budgetLimit = savings_target;
    }
    
    afterExpense = currentSpent + parseFloat(amount);

    res.json({
      suggested_type: suggestedType,
      decision: decision,
      reason: reason,
      suggestion: suggestion,
      budget_status: {
        current_spending: currentSpent,
        budget_limit: budgetLimit,
        after_expense: afterExpense,
        remaining: budgetLimit - currentSpent,
        percentage_used: ((currentSpent / budgetLimit) * 100).toFixed(1)
      },
      all_budgets: {
        productive: {
          limit: productive_limit,
          spent: productive_spent,
          remaining: productive_limit - productive_spent
        },
        unproductive: {
          limit: unproductive_limit,
          spent: unproductive_spent,
          remaining: unproductive_limit - unproductive_spent
        },
        savings: {
          limit: savings_target,
          spent: savings_spent,
          remaining: savings_target - savings_spent
        }
      }
    });
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
});

// Compare expenses
router.post('/compare', auth, async (req, res) => {
  try {
    const { expense1_id, expense2_id } = req.body;

    const e1 = await Expense.findById(expense1_id);
    const e2 = await Expense.findById(expense2_id);

    if (!e1 || !e2) {
      return res.status(404).json({ message: 'Expenses not found' });
    }

    const prompt = `
Compare these two expenses:

1. ${e1.title} - ₹${e1.amount} (${e1.type})
   Purpose: ${e1.purpose}

2. ${e2.title} - ₹${e2.amount} (${e2.type})
   Purpose: ${e2.purpose}

Which is better and why?

Output format:
Best Choice: [1 or 2]
Reason: [brief explanation]
`;

    const aiResponse = await askAI(prompt);

    res.json({
      comparison: aiResponse,
      expense1: e1,
      expense2: e2
    });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
});

module.exports = router;
