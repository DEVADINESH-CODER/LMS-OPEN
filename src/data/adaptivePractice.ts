// Adaptive Learning & Real-World Transfer Scenarios
// Grounded in the 12-step pedagogical rhythm:
// SITUATION -> QUESTION -> THINKING -> LOGIC -> CONCEPT -> SYNTAX -> CODE -> PREDICT -> DEBUG -> MINI PRACTICE -> BRIDGE

import { AdaptiveScenario } from '../types';

export const ADAPTIVE_SCENARIOS: AdaptiveScenario[] = [
  {
    id: 'AS-U1-01',
    unit: 1,
    periodRef: 2,
    topic: 'Variables, Expressions & Mixed Data Types',
    title: 'Food Delivery Order & Discount Calculator',
    realWorldDomain: 'Swiggy / Zomato Checkout',
    emoji: '🍕',
    difficulty: 'starter',
    realWorldSituation: 'You place an order on Swiggy for a Paneer Pizza (₹280) and Garlic Bread (₹120). Delivery fee is ₹35, and GST is 5%. A coupon code offers flat ₹50 off if food subtotal exceeds ₹300.',
    provocativeQuestion: 'How does Swiggy know whether to give you ₹50 off, and why must the 5% tax apply to the food after the discount rather than before?',
    studentThinking: 'First find the total food cost: 280 + 120 = 400. Since 400 > 300, subtract 50 to get discounted subtotal 350. Tax is 5% of 350 = 17.5. Then add delivery 35 to get final total 402.5.',
    computationalLogic: 'Break into distinct named variables: pizza_price (int), bread_price (int), delivery_fee (int), tax_rate (float). Calculate subtotal, apply conditional discount deduction, compute tax, and sum total bill.',
    conceptAndSyntax: 'Variables hold reusable values; expressions evaluate arithmetic with correct type preservation (float vs int).',
    syntaxSnippet: 'subtotal = item1 + item2\ntax = discounted_subtotal * 0.05\ntotal = discounted_subtotal + tax + delivery',
    code: `# Swiggy / Zomato Order Checkout Engine
pizza_price = 280
bread_price = 120
delivery_fee = 35
tax_rate = 0.05  # 5% GST

# 1. Food subtotal
food_subtotal = pizza_price + bread_price

# 2. Coupon: FLAT50 if subtotal > 300
discount = 50 if food_subtotal > 300 else 0
discounted_food = food_subtotal - discount

# 3. Tax and Final Bill
tax_amount = discounted_food * tax_rate
final_bill = discounted_food + tax_amount + delivery_fee

print(f"Items Subtotal:  ₹{food_subtotal}")
print(f"Coupon Discount: -₹{discount}")
print(f"5% GST:          ₹{tax_amount:.2f}")
print(f"Delivery Fee:    ₹{delivery_fee}")
print("----------------------------")
print(f"Total Payable:   ₹{final_bill:.2f}")`,
    expectedOutput: `Items Subtotal:  ₹400
Coupon Discount: -₹50
5% GST:          ₹17.50
Delivery Fee:    ₹35
----------------------------
Total Payable:   ₹402.50`,
    codeExplanation: [
      'pizza_price and bread_price are integer literals.',
      'tax_rate is a floating-point number (0.05).',
      'The inline ternary operator (50 if ... else 0) selects the discount without duplicating the calculation.',
      'f"{tax_amount:.2f}" formats the float to exactly two decimal currency places.'
    ],
    predictChallenge: {
      question: 'What would final_bill be if the customer ordered only the Garlic Bread (₹120)? (Assume delivery fee is ₹35 and tax is 5%)',
      options: ['₹161.00', '₹111.00', '₹155.00', '₹126.00'],
      correctIndex: 0,
      explanation: 'Garlic bread is ₹120 (<= ₹300, so discount is ₹0). Tax is 5% of 120 = ₹6. Total = 120 + 6 + 35 = ₹161.00.'
    },
    debugTrap: {
      buggyCode: `food_subtotal = "280" + "120"
tax = food_subtotal * 0.05`,
      errorType: 'TypeError: can\'t multiply sequence by non-int of type \'float\'',
      whatWentWrong: 'Numbers enclosed in quotation marks ("280", "120") are strings! "280" + "120" produces the concatenated string "280120", which crashes when multiplied by a float.',
      fix: 'Remove quotation marks or cast with int("280") + int("120").'
    },
    miniPractice: {
      challenge: 'Modify the calculation for an order with 2 pizzas at ₹250 each, 1 coke at ₹40, a packaging charge of ₹15, and 10% student festival discount on total food items.',
      hint: 'food = (2 * 250) + 40; discount = food * 0.10; tax = (food - discount) * 0.05; total = food - discount + tax + delivery + packaging.',
      solutionCode: `pizzas = 2 * 250
coke = 40
packaging = 15
delivery = 35

food = pizzas + coke
discount = food * 0.10
taxable = food - discount
tax = taxable * 0.05
total = taxable + tax + delivery + packaging
print(f"Payable: ₹{total:.2f}")  # Payable: ₹549.30`
    },
    bridgeToNext: 'When you order with a friend, how do you swap who pays what, or swap pickup and drop points? That brings us to Tuple Assignment and Precedence!'
  },
  {
    id: 'AS-U1-02',
    unit: 1,
    periodRef: 3,
    topic: 'Tuple Assignment & Operator Precedence',
    title: 'Ride Hailing Fare Split & Location Swap',
    realWorldDomain: 'Ola / Uber Trip Calculator',
    emoji: '🚖',
    difficulty: 'starter',
    realWorldSituation: 'You and your classmate book an Uber Auto. The app charges ₹40 base fare + ₹14 per km. You traveled 8 km. At the destination, you want to swap pickup and drop coordinates to calculate the return fare.',
    provocativeQuestion: 'Why does "base + km_rate * distance" compute the multiplication first, and how do you swap two variables in Python in a single line without creating a temporary variable?',
    studentThinking: 'Math rules (PEMDAS / BODMAS) say multiplication happens before addition: 14 * 8 = 112, then + 40 = 152. In older languages like C, swapping A and B requires a third temp variable. Python lets us write A, B = B, A.',
    computationalLogic: 'Operator precedence rules dictate * takes priority over +. Python tuple packing/unpacking evaluates the right-hand side first into a temporary tuple, then unpacks into the left-hand variables atomically.',
    conceptAndSyntax: 'Precedence: () -> ** -> * / // % -> + -. Simultaneous tuple assignment: var1, var2 = var2, var1.',
    syntaxSnippet: 'fare = base + (rate * distance)\npickup, drop = drop, pickup',
    code: `# Uber / Ola Trip Fare & Coordinate Swap
pickup_landmark = "College Main Gate"
drop_landmark = "Central Railway Station"
distance_km = 8
base_fare = 40
rate_per_km = 14

# Fare calculation (Multiplication takes precedence over addition)
oneway_fare = base_fare + rate_per_km * distance_km

print(f"From: {pickup_landmark} -> To: {drop_landmark}")
print(f"One-way fare: ₹{oneway_fare}")

# Return trip: Swap pickup and drop in a single atomic line!
pickup_landmark, drop_landmark = drop_landmark, pickup_landmark
print("\n--- Return Journey Setup ---")
print(f"From: {pickup_landmark} -> To: {drop_landmark}")`,
    expectedOutput: `From: College Main Gate -> To: Central Railway Station
One-way fare: ₹152

--- Return Journey Setup ---
From: Central Railway Station -> To: College Main Gate`,
    codeExplanation: [
      'rate_per_km * distance_km evaluates first (14 * 8 = 112).',
      'base_fare is added next (40 + 112 = 152).',
      'pickup_landmark, drop_landmark = drop_landmark, pickup_landmark evaluates the right side into a tuple ("Central Railway Station", "College Main Gate") before updating the left side.'
    ],
    predictChallenge: {
      question: 'What is the value of expression: 20 + 10 * 2 ** 2?',
      options: ['120', '60', '80', '1600'],
      correctIndex: 1,
      explanation: 'Exponentiation (2 ** 2 = 4) has highest precedence. Multiplication (10 * 4 = 40) is next. Addition (20 + 40 = 60) is last.'
    },
    debugTrap: {
      buggyCode: `# Trying to swap without tuple assignment:
a = "Main Gate"
b = "Railway Station"
a = b
b = a
print(a, b)`,
      errorType: 'Logic Bug: Overwriting variable prematurely',
      whatWentWrong: 'When a = b runs, "Main Gate" is lost forever. Both a and b become "Railway Station"!',
      fix: 'Use Python tuple assignment: a, b = b, a.'
    },
    miniPractice: {
      challenge: 'Write a program that takes three fuel rates (petrol, diesel, cng) and rotates their values cyclically: petrol takes diesel, diesel takes cng, and cng takes petrol in one single statement.',
      hint: 'petrol, diesel, cng = diesel, cng, petrol',
      solutionCode: `petrol, diesel, cng = 102.5, 92.0, 85.0
petrol, diesel, cng = diesel, cng, petrol
print(f"Petrol: {petrol}, Diesel: {diesel}, CNG: {cng}")`
    },
    bridgeToNext: 'Now that we can do calculations, how does an application make decisions, like whether a user is allowed to stream on 4 devices? Enter Conditionals in Unit II.'
  },
  {
    id: 'AS-U2-01',
    unit: 2,
    periodRef: 8,
    topic: 'Chained Conditionals (if-elif-else)',
    title: 'OTT Streaming Quality & Screen Allowance',
    realWorldDomain: 'Netflix / Hotstar Engine',
    emoji: '🎬',
    difficulty: 'starter',
    realWorldSituation: 'Netflix offers three subscription plans: "Mobile" (₹149, 1 screen, 480p), "Standard" (₹499, 2 screens, 1080p Full HD), and "Premium" (₹649, 4 screens, 4K HDR). When a user presses Play, the server checks if active devices exceed the plan limit.',
    provocativeQuestion: 'Why does checking conditions in the wrong order cause users to receive incorrect video resolutions or false playback errors?',
    studentThinking: 'Check the user\'s registered plan first. Compare active devices against allowed screens. If under limit, return resolution; otherwise, reject with "Screen limit reached".',
    computationalLogic: 'Use a dictionary or if-elif-else cascade. Test exact matching plan names and evaluate strict inequalities (< vs <=).',
    conceptAndSyntax: 'if <condition>: ... elif <condition>: ... else: ... with nested comparison.',
    syntaxSnippet: 'if active_screens >= max_allowed:\n    print("Limit reached")\nelif plan == "Premium":\n    resolution = "4K HDR"',
    code: `# Netflix Playback Permission Checker
user_plan = "Standard"
active_screens = 2  # Already 2 devices watching

# Allowed screens and resolution per plan
if user_plan == "Mobile":
    max_screens = 1
    quality = "480p SD"
elif user_plan == "Standard":
    max_screens = 2
    quality = "1080p Full HD"
elif user_plan == "Premium":
    max_screens = 4
    quality = "4K Ultra HD + Dolby Atmos"
else:
    max_screens = 0
    quality = "None"

# Decision logic for new stream request
if active_screens >= max_screens:
    print(f"❌ Playback Blocked: Your {user_plan} plan allows only {max_screens} active screen(s).")
    print("👉 Upgrade to Premium to watch on up to 4 devices at once.")
else:
    print(f"✅ Stream Authorized: Playing in {quality}.")
    print(f"Screen {active_screens + 1} of {max_screens} now streaming.")`,
    expectedOutput: `❌ Playback Blocked: Your Standard plan allows only 2 active screen(s).
👉 Upgrade to Premium to watch on up to 4 devices at once.`,
    codeExplanation: [
      'The if-elif-else ladder maps the plan string to max_screens and video quality.',
      'The comparison active_screens >= max_screens halts unauthorized stream requests before any video bandwidth is spent.',
      'Using an else branch catches unknown plan names or expired accounts safely.'
    ],
    predictChallenge: {
      question: 'If user_plan is "Premium" and active_screens is 3, what will be printed?',
      options: [
        'Stream Authorized: Playing in 4K Ultra HD + Dolby Atmos.',
        'Playback Blocked: Your Premium plan allows only 4 active screens.',
        'Stream Authorized: Playing in 1080p Full HD.',
        'Error: Screen 4 already in use.'
      ],
      correctIndex: 0,
      explanation: '3 is strictly less than 4 (max_screens for Premium), so active_screens >= 4 is False. The stream is authorized in 4K Ultra HD.'
    },
    debugTrap: {
      buggyCode: `marks = 85
if marks >= 50:
    grade = "Pass"
elif marks >= 80:
    grade = "Distinction"
print(grade)`,
      errorType: 'Logic Bug: Incorrect condition order',
      whatWentWrong: 'Because marks >= 50 is checked first, 85 matches the first branch and sets grade = "Pass"! The elif marks >= 80 will never be reached.',
      fix: 'Always check the most restrictive condition first: check marks >= 80 first, then marks >= 50.'
    },
    miniPractice: {
      challenge: 'Write a program for an Amazon delivery speed calculator: Prime member + Order > ₹499 = "Free Same Day", Prime member + Order <= ₹499 = "Free One Day", Non-Prime = "Standard Delivery (₹40)".',
      hint: 'Check if is_prime first, then check order_value.',
      solutionCode: `is_prime = True
order_value = 650

if is_prime and order_value > 499:
    delivery = "Free Same Day Delivery"
elif is_prime:
    delivery = "Free One Day Delivery"
else:
    delivery = "Standard Delivery (₹40)"
print(delivery)`
    },
    bridgeToNext: 'When an action must be retried repeatedly until success or timeout—like entering an OTP—we need loops and state management.'
  },
  {
    id: 'AS-U2-02',
    unit: 2,
    periodRef: 9,
    topic: 'While Loops & Loop State Variables',
    title: 'UPI Payment PIN Verification with Attempt Lock',
    realWorldDomain: 'Google Pay / PhonePe Security',
    emoji: '💳',
    difficulty: 'intermediate',
    realWorldSituation: 'When authorizing a ₹1,200 transaction on Google Pay, you must enter a 4-digit UPI PIN. The security policy permits at most 3 incorrect attempts before locking your account for 24 hours.',
    provocativeQuestion: 'Why does an ATM or UPI app use a while loop with an attempt counter rather than a fixed for loop, and how does the loop terminate immediately when the correct PIN is entered?',
    studentThinking: 'Keep asking until either the PIN matches (success) OR attempts run out (lockout). That means the loop continues while (attempts < 3) and not verified.',
    computationalLogic: 'Initialize attempts = 0 and is_success = False. On each iteration, increment attempts. If input equals actual PIN, set is_success = True and break.',
    conceptAndSyntax: 'while condition: ... with an internal break or state flag change.',
    syntaxSnippet: 'while attempts < max_attempts:\n    if try_pin == correct_pin:\n        break\n    attempts += 1',
    code: `# UPI Payment Authentication Simulator
CORRECT_PIN = "7410"
MAX_ATTEMPTS = 3

entered_pins = ["1234", "0000", "7410"]  # Simulated user entries
attempts_used = 0
payment_successful = False

while attempts_used < MAX_ATTEMPTS:
    current_attempt = entered_pins[attempts_used]
    attempts_used += 1
    
    if current_attempt == CORRECT_PIN:
        payment_successful = True
        print(f"Attempt {attempts_used}: PIN Verified! ✅")
        break
    else:
        remaining = MAX_ATTEMPTS - attempts_used
        print(f"Attempt {attempts_used}: Incorrect PIN ❌ ({remaining} attempt(s) remaining)")

if payment_successful:
    print("💸 Payment of ₹1,200.00 successful to Merchant!")
else:
    print("🔒 Account Locked for 24 hours due to 3 consecutive failed PIN attempts.")`,
    expectedOutput: `Attempt 1: Incorrect PIN ❌ (2 attempt(s) remaining)
Attempt 2: Incorrect PIN ❌ (1 attempt(s) remaining)
Attempt 3: PIN Verified! ✅
💸 Payment of ₹1,200.00 successful to Merchant!`,
    codeExplanation: [
      'attempts_used tracks how many tries have taken place.',
      'The while condition attempts_used < MAX_ATTEMPTS ensures we never exceed the safety threshold.',
      'The break statement exits the loop immediately when the correct PIN is encountered on attempt 3.',
      'The payment_successful boolean flag cleanly separates the loop execution from the final notification logic.'
    ],
    predictChallenge: {
      question: 'What would happen if the user entered ["1111", "2222", "3333"]?',
      options: [
        'The loop runs 3 times and prints Account Locked.',
        'The loop runs forever because payment_successful is False.',
        'The loop runs once and crashes with IndexError.',
        'Payment of ₹1,200 is approved anyway.'
      ],
      correctIndex: 0,
      explanation: 'All 3 attempts fail, attempts_used reaches 3, the while loop exits, payment_successful remains False, and "Account Locked for 24 hours" is displayed.'
    },
    debugTrap: {
      buggyCode: `count = 1
while count <= 5:
    print("Processing...")
    # Forgot: count += 1`,
      errorType: 'Infinite Loop',
      whatWentWrong: 'count is never modified inside the loop body, so count <= 5 is always True. The program hangs and runs infinitely.',
      fix: 'Always ensure the state variable is updated on every iteration: add count += 1.'
    },
    miniPractice: {
      challenge: 'Write a while loop that simulates a 30-second download progress bar: start at downloaded_mb = 0, increment by 25 MB each step, and stop when downloaded_mb reaches total_size = 100 MB.',
      hint: 'while downloaded < total: downloaded += 25',
      solutionCode: `downloaded = 0
total = 100
while downloaded < total:
    downloaded += 25
    percent = (downloaded / total) * 100
    print(f"Downloaded {downloaded}MB / {total}MB ({percent:.0f}%)")`
    },
    bridgeToNext: 'When you know the collection of items beforehand (like songs in a playlist), a for loop is much cleaner than while.'
  },
  {
    id: 'AS-U2-03',
    unit: 2,
    periodRef: 12,
    topic: 'Function Composition & Recursion',
    title: 'E-Commerce Category Hierarchy (Breadcrumb Navigation)',
    realWorldDomain: 'Amazon Product Categories',
    emoji: '🌲',
    difficulty: 'mastery',
    realWorldSituation: 'When browsing Amazon, a product like "iPhone Case" lives inside a deep hierarchy: Electronics -> Mobile Phones -> Accessories -> Cases. The website needs to generate the full breadcrumb path from the deepest category back to Home.',
    provocativeQuestion: 'Why is recursion the natural way to trace nested hierarchies, and what happens if a category points to itself without a base case?',
    studentThinking: 'To find the path to the current category: first find the path to its parent, then tack on the current category name. When parent is None ("Home"), stop!',
    computationalLogic: 'A base case: if category is "Home", return ["Home"]. Recursive case: return get_path(parent) + [current_category].',
    conceptAndSyntax: 'def func(node): if base_case: return ... else: return func(node.parent) + ...',
    syntaxSnippet: 'def get_breadcrumbs(cat):\n    if cat["parent"] is None:\n        return [cat["name"]]\n    return get_breadcrumbs(categories[cat["parent"]]) + [cat["name"]]',
    code: `# Amazon Category Breadcrumb Generator via Recursion
category_tree = {
    "Home": {"parent": None},
    "Electronics": {"parent": "Home"},
    "Mobiles": {"parent": "Electronics"},
    "Accessories": {"parent": "Mobiles"},
    "Cases & Covers": {"parent": "Accessories"}
}

def build_breadcrumb(category_name):
    node = category_tree.get(category_name)
    # Base Case: Reached the root node
    if node is None or node["parent"] is None:
        return [category_name]
    
    # Recursive Case: Path of parent + current node
    parent_path = build_breadcrumb(node["parent"])
    return parent_path + [category_name]

# Generate navigation for user browsing cases
current_browsing = "Cases & Covers"
path = build_breadcrumb(current_browsing)
print("Breadcrumb Navigation:")
print(" > ".join(path))`,
    expectedOutput: `Breadcrumb Navigation:
Home > Electronics > Mobiles > Accessories > Cases & Covers`,
    codeExplanation: [
      'Base Case: When node["parent"] is None, the function stops recursing and returns ["Home"].',
      'Recursive Step: Each call waits for the parent category to resolve its path before appending its own name.',
      '" > ".join(path) formats the resulting list into the classic web breadcrumb UI.'
    ],
    predictChallenge: {
      question: 'What would happen if category_tree had a loop where "Electronics" had parent "Mobiles" and "Mobiles" had parent "Electronics"?',
      options: [
        'RecursionError: maximum recursion depth exceeded',
        'It returns None',
        'It terminates after 2 hops',
        'SyntaxError'
      ],
      correctIndex: 0,
      explanation: 'Without reaching a base case (None), the function calls itself indefinitely until Python raises RecursionError (stack overflow).'
    },
    debugTrap: {
      buggyCode: `def countdown(n):
    print(n)
    return countdown(n - 1)  # No if n == 0 check!`,
      errorType: 'RecursionError: maximum recursion depth exceeded',
      whatWentWrong: 'Missing base case! The function continues calling countdown(-1), countdown(-2), etc.',
      fix: 'Add \`if n <= 0: return\` at the top of the recursive function.'
    },
    miniPractice: {
      challenge: 'Write a recursive function calculate_folder_size(folder) where a folder dictionary contains "size" (number) and "subfolders" (list of subfolder dictionaries).',
      hint: 'total = folder["size"] + sum(calculate_folder_size(sub) for sub in folder["subfolders"])',
      solutionCode: `def folder_size(folder):
    total = folder.get("size", 0)
    for sub in folder.get("subfolders", []):
        total += folder_size(sub)
    return total

sample = {"size": 10, "subfolders": [{"size": 5, "subfolders": []}, {"size": 20, "subfolders": []}]}
print(f"Total size: {folder_size(sample)}MB")  # 35MB`
    },
    bridgeToNext: 'Now let\'s move to Unit III: how do we store and manipulate collections of data in memory using lists, tuples, and dictionaries?'
  },
  {
    id: 'AS-U3-01',
    unit: 3,
    periodRef: 15,
    topic: 'List Mutability, Aliasing & Cloning',
    title: 'Multiplayer Game Shared Party Inventory Trap',
    realWorldDomain: 'Gaming / RPG Inventory Bug',
    emoji: '⚔️',
    difficulty: 'intermediate',
    realWorldSituation: 'In an online RPG game, Player 1 and Player 2 form a guild party. The programmer intended to give Player 2 an identical starter kit: weapons = ["Iron Sword", "Health Potion", "Wooden Shield"]. The developer wrote: player2_bag = player1_bag.',
    provocativeQuestion: 'When Player 1 drinks their "Health Potion", why does Player 2\'s potion mysteriously disappear from their bag as well?',
    studentThinking: 'player1_bag and player2_bag aren\'t two separate bags; they are two labels on the exact same physical bag in memory! Modifying one modifies both.',
    computationalLogic: 'Assignment (=) copies only the memory reference (pointer), not the contents. To get an independent copy, you must clone using .copy() or slice [:].',
    conceptAndSyntax: 'Aliasing: list_b = list_a (shared). Cloning: list_b = list_a.copy() (independent).',
    syntaxSnippet: 'safe_bag = original_bag.copy()  # Independent list in memory',
    code: `# RPG Game Inventory Bug Demo
# BUGGY WAY (Aliasing):
p1_bag = ["Iron Sword", "Health Potion", "Wooden Shield"]
p2_bag = p1_bag  # Aliasing trap: points to the SAME list!

print("Initial bags (Aliased):")
print(f"Player 1: {p1_bag}")
print(f"Player 2: {p2_bag}")

# Player 1 uses their health potion
p1_bag.remove("Health Potion")
print("\nAfter Player 1 used Health Potion:")
print(f"Player 1: {p1_bag}")
print(f"Player 2: {p2_bag}  <-- BUG: P2 lost their potion too!")

# FIXED WAY (Cloning with .copy()):
p1_bag = ["Iron Sword", "Health Potion", "Wooden Shield"]
p2_bag = p1_bag.copy()  # Brand new list cloned in memory!

p1_bag.remove("Health Potion")
print("\nFixed with .copy():")
print(f"Player 1: {p1_bag}")
print(f"Player 2: {p2_bag}  <-- SUCCESS: P2 still has their potion!")`,
    expectedOutput: `Initial bags (Aliased):
Player 1: ['Iron Sword', 'Health Potion', 'Wooden Shield']
Player 2: ['Iron Sword', 'Health Potion', 'Wooden Shield']

After Player 1 used Health Potion:
Player 1: ['Iron Sword', 'Wooden Shield']
Player 2: ['Iron Sword', 'Wooden Shield']  <-- BUG: P2 lost their potion too!

Fixed with .copy():
Player 1: ['Iron Sword', 'Wooden Shield']
Player 2: ['Iron Sword', 'Health Potion', 'Wooden Shield']  <-- SUCCESS: P2 still has their potion!`,
    codeExplanation: [
      'p2_bag = p1_bag creates an alias: both variables refer to the exact same list address in RAM (id(p1_bag) == id(p2_bag)).',
      'Calling .remove() on either variable mutates the underlying shared memory block.',
      '.copy() allocates a brand new list in RAM with cloned elements, isolating Player 2.'
    ],
    predictChallenge: {
      question: 'If a = [1, 2, 3] and b = a, what will print(a is b) return?',
      options: ['True', 'False', 'None', 'Error'],
      correctIndex: 0,
      explanation: 'The "is" keyword checks memory identity. Because b is an alias for a, both point to the exact same memory object, so a is b evaluates to True.'
    },
    debugTrap: {
      buggyCode: `def add_bonus(scores):
    scores.append(10)
    return scores

my_scores = [80, 90]
new_scores = add_bonus(my_scores)
print(my_scores)  # Expected [80, 90], but prints [80, 90, 10]!`,
      errorType: 'Unintended Mutation of Mutable Function Argument',
      whatWentWrong: 'Lists are passed by reference. Modifying scores inside the function mutates my_scores in the caller!',
      fix: 'Clone inside the function: scores = scores.copy(), then append.'
    },
    miniPractice: {
      challenge: 'Create a list of top 3 scores. Clone it, sort the cloned list in ascending order, and prove that the original score list remains in its original order.',
      hint: 'cloned = original.copy(); cloned.sort()',
      solutionCode: `original = [95, 42, 88]
cloned = original.copy()
cloned.sort()
print(f"Original: {original}")  # [95, 42, 88]
print(f"Sorted:   {cloned}")    # [42, 88, 95]`
    },
    bridgeToNext: 'When you need to look up data by a meaningful name or ID rather than numeric 0, 1, 2 indices, dictionaries are the weapon of choice.'
  },
  {
    id: 'AS-U3-02',
    unit: 3,
    periodRef: 17,
    topic: 'Dictionaries & List Comprehensions',
    title: 'Social Media Creator Analytics & Viral Post Filter',
    realWorldDomain: 'Instagram / YouTube Analytics',
    emoji: '📱',
    difficulty: 'intermediate',
    realWorldSituation: 'A digital marketing agency manages 5 influencer accounts. They store post metrics (likes, comments, reach) as dictionaries. They need to extract posts that crossed 10,000 likes in a single list comprehension.',
    provocativeQuestion: 'Why is searching a dictionary by key instantaneous compared to searching a list, and how does list comprehension replace a 5-line for loop with 1 readable line?',
    studentThinking: 'Dictionaries use hash maps so looking up posts["p101"] doesn\'t scan every item. List comprehension lets us specify [expression for item in list if condition].',
    computationalLogic: 'Use .get(key, default) for bulletproof lookup without KeyError. Filter list of post records using [p["id"] for p in posts if p["likes"] >= 10000].',
    conceptAndSyntax: 'dict.get(key, default); [expr for item in iterable if condition]',
    syntaxSnippet: 'viral_posts = [p["title"] for p in posts if p["likes"] >= 10_000]',
    code: `# Instagram Influencer Post Analytics
posts = [
    {"id": "POST_101", "title": "Coding in Tamil Reel", "likes": 14200, "comments": 850},
    {"id": "POST_102", "title": "Hostel Life Meme", "likes": 8900, "comments": 420},
    {"id": "POST_103", "title": "Python Hackathon Win", "likes": 22100, "comments": 1430},
    {"id": "POST_104", "title": "Canteen Samosa Review", "likes": 4100, "comments": 210}
]

# 1. Safe lookup with .get()
featured_post = posts[0]
views = featured_post.get("views", "Not tracked yet")
print(f"Post '{featured_post['title']}' Views: {views}")

# 2. List comprehension to extract viral posts (>= 10,000 likes)
viral_titles = [p["title"] for p in posts if p["likes"] >= 10000]

print("\n🚀 Viral Posts (>10k likes):")
for idx, title in enumerate(viral_titles, 1):
    print(f"  {idx}. {title}")

# 3. Calculate total engagement of viral posts
total_viral_likes = sum(p["likes"] for p in posts if p["likes"] >= 10000)
print(f"\nTotal Viral Reach: {total_viral_likes:,} likes")`,
    expectedOutput: `Post 'Coding in Tamil Reel' Views: Not tracked yet

🚀 Viral Posts (>10k likes):
  1. Coding in Tamil Reel
  2. Python Hackathon Win

Total Viral Reach: 36,300 likes`,
    codeExplanation: [
      'featured_post.get("views", "Not tracked yet") avoids crashing with a KeyError when a key doesn\'t exist.',
      '[p["title"] for p in posts if p["likes"] >= 10000] transforms and filters in one clean expression.',
      '{total_viral_likes:,} uses Python format specifier to display readable commas in numbers.'
    ],
    predictChallenge: {
      question: 'What does [x**2 for x in [1, 2, 3, 4] if x % 2 == 0] produce?',
      options: ['[4, 16]', '[1, 9]', '[1, 4, 9, 16]', '[2, 4]'],
      correctIndex: 0,
      explanation: 'Only even numbers 2 and 4 satisfy x % 2 == 0. Their squares are 2**2 = 4 and 4**2 = 16.'
    },
    debugTrap: {
      buggyCode: `user = {"name": "Arun", "roll": "26009479"}
print(user["email"])  # User didn't register email!`,
      errorType: 'KeyError: \'email\'',
      whatWentWrong: 'Accessing a missing key with square brackets [] crashes the entire program with KeyError.',
      fix: 'Use user.get("email", "No email on record") instead.'
    },
    miniPractice: {
      challenge: 'Given prices = {"shirt": 800, "shoes": 2500, "socks": 150, "jacket": 4200}, use a dictionary comprehension to create a new dictionary containing only items costing more than ₹1000 with a 15% discount applied.',
      hint: '{k: v * 0.85 for k, v in prices.items() if v > 1000}',
      solutionCode: `prices = {"shirt": 800, "shoes": 2500, "socks": 150, "jacket": 4200}
sale = {k: v * 0.85 for k, v in prices.items() if v > 1000}
print(sale)  # {'shoes': 2125.0, 'jacket': 3570.0}`
    },
    bridgeToNext: 'Data in memory vanishes when your computer turns off. How do we save it to disk permanently, and how do we prevent bad data from crashing the app? Unit IV Files & Exceptions.'
  },
  {
    id: 'AS-U4-01',
    unit: 4,
    periodRef: 21,
    topic: 'File Persistence & Exception Handling (try/except)',
    title: 'Hospital ICU Sensor Log & Corrupt Row Recovery',
    realWorldDomain: 'Healthcare / Critical IoT Logs',
    emoji: '🏥',
    difficulty: 'intermediate',
    realWorldSituation: 'An ICU monitor records heart rate and blood oxygen (SpO2) every minute into a text log. Occasionally, a sensor glitch writes corrupted values like "ERR_TIMEOUT" or "NAN" instead of an integer. The hospital software must never crash, but must log the anomaly and keep monitoring.',
    provocativeQuestion: 'If row 42 of 10,000 has corrupted text, should the whole medical monitor crash, or should exception handling quarantine the bad line?',
    studentThinking: 'Wrap the conversion int(value) inside a try block. If it throws a ValueError, catch it with except ValueError, alert the staff, and continue to the next patient.',
    computationalLogic: 'Use try: ... except ValueError as err: ... inside the file reading loop. Use finally or "with" context manager to guarantee the log file is properly closed.',
    conceptAndSyntax: 'try: ... except (ValueError, ZeroDivisionError) as e: ...',
    syntaxSnippet: 'try:\n    val = int(raw_data)\nexcept ValueError:\n    log_corrupt_entry()',
    code: `# Hospital ICU Sensor Log Processor with Crash Recovery
raw_sensor_log = """10:01,Patient_A,72,98
10:02,Patient_A,75,97
10:03,Patient_A,SENSOR_DISCONNECTED,97
10:04,Patient_A,80,96
10:05,Patient_A,INVALID_BYTE,ERR_PROBE"""

valid_heart_rates = []
corrupted_rows = 0

print("🔍 Parsing ICU vitals log...")
for line_no, entry in enumerate(raw_sensor_log.strip().split('\\n'), 1):
    parts = entry.split(',')
    timestamp, patient, hr_str, spo2_str = parts
    
    try:
        hr = int(hr_str)
        spo2 = int(spo2_str)
        valid_heart_rates.append(hr)
        print(f"  [Line {line_no}] OK: HR={hr} bpm, SpO2={spo2}%")
    except ValueError as e:
        corrupted_rows += 1
        print(f"  ⚠️ [Line {line_no}] CORRUPT ROW QUARANTINED: '{entry}' (Reason: {e})")

avg_hr = sum(valid_heart_rates) / len(valid_heart_rates)
print("------------------------------------------")
print(f"Total Valid Readings: {len(valid_heart_rates)}")
print(f"Quarantined Anomalies: {corrupted_rows}")
print(f"Average Heart Rate:   {avg_hr:.1f} bpm")`,
    expectedOutput: `🔍 Parsing ICU vitals log...
  [Line 1] OK: HR=72 bpm, SpO2=98%
  [Line 2] OK: HR=75 bpm, SpO2=97%
  ⚠️ [Line 3] CORRUPT ROW QUARANTINED: '10:03,Patient_A,SENSOR_DISCONNECTED,97' (Reason: invalid literal for int() with base 10: 'SENSOR_DISCONNECTED')
  [Line 4] OK: HR=80 bpm, SpO2=96%
  ⚠️ [Line 5] CORRUPT ROW QUARANTINED: '10:05,Patient_A,INVALID_BYTE,ERR_PROBE' (Reason: invalid literal for int() with base 10: 'INVALID_BYTE')
------------------------------------------
Total Valid Readings: 3
Quarantined Anomalies: 2
Average Heart Rate:   75.7 bpm`,
    codeExplanation: [
      'int(hr_str) would normally terminate the entire Python process when it hits "SENSOR_DISCONNECTED".',
      'The try ... except ValueError block intercepts the exception cleanly without terminating.',
      'The hospital monitor continues calculating average heart rate for all valid sensor ticks.'
    ],
    predictChallenge: {
      question: 'Why should you avoid using a bare "except:" without specifying an error type (like except ValueError)?',
      options: [
        'A bare except will also catch SystemExit, KeyboardInterrupt (Ctrl+C), and hidden programming bugs, making it impossible to stop or debug.',
        'It is slower to execute.',
        'Python doesn\'t allow bare except statements.',
        'It only works inside functions.'
      ],
      correctIndex: 0,
      explanation: 'A bare except catches BaseException, which silences critical keyboard interrupts and real syntax/variable errors, hiding fatal bugs.'
    },
    debugTrap: {
      buggyCode: `try:
    file = open("data.txt", "w")
    file.write("Important record")
    # If error happens here, file.close() is skipped!
    file.close()`,
      errorType: 'Resource Leak: Unclosed File Handle',
      whatWentWrong: 'If an error occurs before file.close(), the file handle stays locked by the OS, risking data corruption.',
      fix: 'Use Python\'s \`with open("data.txt", "w") as file:\` statement which guarantees automatic closing.'
    },
    miniPractice: {
      challenge: 'Write a safe integer division function safe_divide(numerator, denominator) that catches both ZeroDivisionError and TypeError, returning None if an error occurs.',
      hint: 'try: return a / b except (ZeroDivisionError, TypeError): return None',
      solutionCode: `def safe_divide(a, b):
    try:
        return a / b
    except (ZeroDivisionError, TypeError) as e:
        print(f"Division failed: {e}")
        return None

print(safe_divide(10, 2))   # 5.0
print(safe_divide(10, 0))   # None
print(safe_divide(10, "x")) # None`
    },
    bridgeToNext: 'Now that we can protect against crashes, how do we bundle state and behavior together instead of scattering loose variables? Unit IV Classes and Objects.'
  },
  {
    id: 'AS-U4-02',
    unit: 4,
    periodRef: 23,
    topic: 'Classes & Objects (Encapsulation & Methods)',
    title: 'Music Streaming Audio Track & Playlist Object',
    realWorldDomain: 'Spotify Audio Architecture',
    emoji: '🎵',
    difficulty: 'intermediate',
    realWorldSituation: 'Spotify manages hundreds of millions of songs. Each song has a title, artist, duration in seconds, and play count. Instead of passing 4 separate lists around, Spotify bundles everything into a Song class.',
    provocativeQuestion: 'Why does an object-oriented approach keep your code organized when an entity has both data (attributes) and actions (methods)?',
    studentThinking: 'A song is a unified concept. It should know its own data and know how to perform actions on itself, like track.play() or track.format_duration().',
    computationalLogic: 'Define class Song with an __init__(self, title, artist, duration) constructor. Add methods play() and get_duration_formatted().',
    conceptAndSyntax: 'class ClassName: def __init__(self, ...): self.x = x',
    syntaxSnippet: 'class Song:\n    def __init__(self, title, artist, seconds):\n        self.title = title\n        self.plays = 0',
    code: `# Spotify Song Class Architecture
class Song:
    def __init__(self, title, artist, duration_seconds):
        self.title = title
        self.artist = artist
        self.duration_seconds = duration_seconds
        self.plays = 0  # Initial play count
        
    def play(self):
        """Simulates streaming this track"""
        self.plays += 1
        print(f"▶️ Now Playing: '{self.title}' by {self.artist}")
        
    def format_duration(self):
        """Formats seconds into MM:SS format"""
        minutes = self.duration_seconds // 60
        seconds = self.duration_seconds % 60
        return f"{minutes}:{seconds:02d}"

# Instantiate two Song objects
song1 = Song("Naa Ready", "Anirudh Ravichander", 248)
song2 = Song("Hukum", "Anirudh Ravichander", 206)

# Interact with the objects
print(f"Track: {song1.title} ({song1.format_duration()})")
song1.play()
song1.play()
song2.play()

print("\n📊 Play Analytics:")
print(f"  '{song1.title}' plays: {song1.plays}")
print(f"  '{song2.title}' plays: {song2.plays}")`,
    expectedOutput: `Track: Naa Ready (4:08)
▶️ Now Playing: 'Naa Ready' by Anirudh Ravichander
▶️ Now Playing: 'Naa Ready' by Anirudh Ravichander
▶️ Now Playing: 'Hukum' by Anirudh Ravichander

📊 Play Analytics:
  'Naa Ready' plays: 2
  'Hukum' plays: 1`,
    codeExplanation: [
      '__init__ is the initializer method automatically invoked when Song(...) is created.',
      'self refers to the specific instance receiving the method call.',
      'Each song object maintains its own isolated self.plays counter in memory.'
    ],
    predictChallenge: {
      question: 'What is the role of the "self" parameter in Python class methods?',
      options: [
        'It explicitly passes the reference to the current object instance so methods can access its own attributes.',
        'It is a special keyword that imports standard library modules.',
        'It makes the variable global across all classes.',
        'It is optional and can be omitted in Python 3.'
      ],
      correctIndex: 0,
      explanation: 'In Python, self represents the specific instance of the class being operated upon, allowing methods to read and modify that instance\'s attributes.'
    },
    debugTrap: {
      buggyCode: `class Student:
    def __init__(name, roll):  # Forgot self!
        name = name
        roll = roll`,
      errorType: 'TypeError: __init__() takes 2 positional arguments but 3 were given',
      whatWentWrong: 'Python passes the new instance as the first argument automatically. If you omit self, arguments get offset and attributes are not saved on the instance!',
      fix: 'Always declare self as the first parameter: def __init__(self, name, roll): self.name = name; self.roll = roll.'
    },
    miniPractice: {
      challenge: 'Create a BankAccount class with account_number, holder_name, and balance. Add deposit(amount) and withdraw(amount) methods with sufficient balance verification.',
      hint: 'def withdraw(self, amount): if amount <= self.balance: self.balance -= amount else: print("Insufficient")',
      solutionCode: `class BankAccount:
    def __init__(self, acc_num, name, initial_balance=500):
        self.acc_num = acc_num
        self.name = name
        self.balance = initial_balance
        
    def deposit(self, amt):
        self.balance += amt
        print(f"Deposited ₹{amt}. New balance: ₹{self.balance}")
        
    def withdraw(self, amt):
        if amt <= self.balance:
            self.balance -= amt
            print(f"Withdrew ₹{amt}. New balance: ₹{self.balance}")
        else:
            print("❌ Insufficient funds!")

acc = BankAccount("1001", "Karthik", 1000)
acc.deposit(500)
acc.withdraw(2000)`
    },
    bridgeToNext: 'When handling tabular numerical data across thousands of items, Python lists become slow. Unit V introduces NumPy and Pandas for fast vectorized operations.'
  },
  {
    id: 'AS-U5-01',
    unit: 5,
    periodRef: 26,
    topic: 'NumPy 2D Arrays, Indexing & Matrix Slicing',
    title: 'IPL Cricket Match Bowling Economy & Run Rate Matrix',
    realWorldDomain: 'IPL / BCCI Sports Analytics',
    emoji: '🏏',
    difficulty: 'mastery',
    realWorldSituation: 'In an IPL cricket match, an analyst logs the runs conceded by 4 bowlers across 4 overs as a 4x4 matrix. They need to extract the death overs (overs 3 and 4) for all bowlers, calculate total runs, and find who bowled the most economical spell.',
    provocativeQuestion: 'Why does a NumPy array allow slicing across rows and columns simultaneously with "matrix[:, 2:]" while standard Python lists require nested for loops?',
    studentThinking: 'NumPy arrays store elements contiguously in memory with uniform types. Slicing with [row_slice, col_slice] lets you extract any sub-grid instantly without loops.',
    computationalLogic: 'Use np.array(data), matrix[:, [2, 3]] to slice columns 2 and 3. Use matrix.sum(axis=1) to sum across overs for each bowler.',
    conceptAndSyntax: 'arr[row_start:row_end, col_start:col_end]; arr.sum(axis=1)',
    syntaxSnippet: 'death_overs = bowling_matrix[:, 2:]  # All bowlers, overs 3 and 4\neconomy = total_runs / overs',
    code: `# IPL Match Bowling Economy & Over Analysis (Simulated via pure Python/NumPy logic)
# Row: [Bumrah, Shami, Jadeja, Ashwin]
# Col: [Over 1, Over 2, Over 3, Over 4]
bowling_data = [
    [4, 6, 8, 5],    # Bumrah: 23 runs
    [10, 8, 14, 12], # Shami: 44 runs
    [6, 5, 7, 6],    # Jadeja: 24 runs
    [8, 7, 9, 8]     # Ashwin: 32 runs
]
bowlers = ["Jasprit Bumrah", "Mohammed Shami", "Ravindra Jadeja", "Ravichandran Ashwin"]

# 1. Total runs conceded per bowler
totals = [sum(row) for row in bowling_data]

# 2. Extract Death Overs (Over 3 & Over 4 -> col index 2 and 3)
death_overs = [[row[2], row[3]] for row in bowling_data]

# 3. Compute economy rate (Runs per over across 4 overs)
economies = [round(tot / 4, 2) for tot in totals]

print("🏏 IPL Match Bowling Analytics:")
for i, name in enumerate(bowlers):
    print(f"  {name:20} | 4-Overs Total: {totals[i]:2} runs | Economy: {economies[i]} | Death (Overs 3-4): {death_overs[i]}")

# Find most economical bowler
min_idx = economies.index(min(economies))
print("------------------------------------------------------------------------")
print(f"🏆 Bowler of the Match: {bowlers[min_idx]} (Economy: {economies[min_idx]} RPO)")`,
    expectedOutput: `🏏 IPL Match Bowling Analytics:
  Jasprit Bumrah       | 4-Overs Total: 23 runs | Economy: 5.75 | Death (Overs 3-4): [8, 5]
  Mohammed Shami       | 4-Overs Total: 44 runs | Economy: 11.0 | Death (Overs 3-4): [14, 12]
  Ravindra Jadeja      | 4-Overs Total: 24 runs | Economy: 6.0 | Death (Overs 3-4): [7, 6]
  Ravichandran Ashwin  | 4-Overs Total: 32 runs | Economy: 8.0 | Death (Overs 3-4): [9, 8]
------------------------------------------------------------------------
🏆 Bowler of the Match: Jasprit Bumrah (Economy: 5.75 RPO)`,
    codeExplanation: [
      'The 2D structure mirrors a NumPy 2D array matrix representation.',
      'Slicing row[2:] isolates columns 2 and 3 (the death overs) across all bowlers.',
      'min(economies) effortlessly discovers the most disciplined spell without manual iteration.'
    ],
    predictChallenge: {
      question: 'In a NumPy array of shape (4, 4), what does arr[0, :] represent?',
      options: [
        'The entire first row (all overs bowled by Bumrah)',
        'The entire first column (Over 1 for all bowlers)',
        'A single number at row 0, col 0',
        'An empty slice'
      ],
      correctIndex: 0,
      explanation: 'In NumPy notation arr[row, col], the index 0 in the row position picks row 0, and ":" in the column position selects all columns in that row.'
    },
    debugTrap: {
      buggyCode: `# Trying to slice columns from a standard Python list:
matrix = [[1, 2], [3, 4]]
col1 = matrix[:, 0]  # Crashes!`,
      errorType: 'TypeError: list indices must be integers or slices, not tuple',
      whatWentWrong: 'Standard Python lists don\'t support 2D multi-dimensional indexing with tuples [:, 0]. That is a NumPy-specific superpower.',
      fix: 'Convert to NumPy array first: import numpy as np; np.array(matrix)[:, 0].'
    },
    miniPractice: {
      challenge: 'Create a 3x3 matrix representing exam marks of 3 students in 3 subjects: [[75, 80, 90], [60, 65, 70], [85, 90, 95]]. Find the highest mark scored in Subject 2 (middle column).',
      hint: 'Extract middle column [row[1] for row in matrix], then use max().',
      solutionCode: `marks = [[75, 80, 90], [60, 65, 70], [85, 90, 95]]
sub2_marks = [row[1] for row in marks]
print(f"Subject 2 highest mark: {max(sub2_marks)}")  # 90`
    },
    bridgeToNext: 'When real-world records include names, missing scores, roll numbers, and CSV files, Pandas DataFrames take over from raw arrays.'
  },
  {
    id: 'AS-U5-02',
    unit: 5,
    periodRef: 29,
    topic: 'Pandas DataFrames, Missing Values & CSV Merging',
    title: 'Semester Results & Attendance Merging Pipeline',
    realWorldDomain: 'College Examination Controller',
    emoji: '📊',
    difficulty: 'mastery',
    realWorldSituation: 'The college controller of examinations receives two separate files: an Exam Marks sheet and an Attendance register. Some students were absent for exams (producing NaN missing values). The system must merge both sheets on "roll_no", fill missing marks with 0, and flag students with <75% attendance.',
    provocativeQuestion: 'Why is merging on a unique primary key like roll_no safer than matching row numbers, and how does .fillna(0) keep averages accurate?',
    studentThinking: 'If student 3 dropped out, the two lists will have different lengths. Merging by "roll_no" ensures Student 101\'s attendance is always tied to Student 101\'s marks.',
    computationalLogic: 'Perform an inner or left join on "roll_no". Fill missing test marks with 0 using .fillna(0). Add a boolean column "eligible" where attendance >= 75 and marks >= 50.',
    conceptAndSyntax: 'pd.merge(df1, df2, on="roll_no"); df.fillna(0); df["eligible"] = ...',
    syntaxSnippet: 'merged = pd.merge(marks_df, attendance_df, on="roll_no")\nmerged["marks"] = merged["marks"].fillna(0)',
    code: `# Student Academic Results & Attendance Merger
# Simulated DataFrame structure for high performance
exam_records = [
    {"roll_no": "26009479", "name": "Abishek S", "marks": 88},
    {"roll_no": "26009480", "name": "Bavithra M", "marks": None},  # Absent
    {"roll_no": "26009481", "name": "Chandru K", "marks": 74},
    {"roll_no": "26009482", "name": "Dinesh D", "marks": 92}
]

attendance_records = {
    "26009479": 92.5,
    "26009480": 68.0,  # Below 75%
    "26009481": 84.0,
    "26009482": 95.0
}

# 1. Merge and handle missing values (.fillna)
combined_report = []
for student in exam_records:
    r_no = student["roll_no"]
    raw_marks = student["marks"]
    
    # Missing data imputation: replace None with 0
    clean_marks = 0 if raw_marks is None else raw_marks
    att_pct = attendance_records.get(r_no, 0.0)
    
    # Eligibility rule: Attendance >= 75% AND Marks >= 50
    eligible = att_pct >= 75.0 and clean_marks >= 50
    
    combined_report.append({
        "roll_no": r_no,
        "name": student["name"],
        "marks": clean_marks,
        "attendance": att_pct,
        "eligible": eligible
    })

print("🎓 Final Semester Clearance Report:")
print(f"{'Roll No':<10} | {'Name':<12} | {'Marks':<5} | {'Att %':<6} | {'Status'}")
print("-" * 52)
for rec in combined_report:
    status = "✅ PASS / CLEARED" if rec["eligible"] else "❌ DETAINED / FAIL"
    print(f"{rec['roll_no']:<10} | {rec['name']:<12} | {rec['marks']:<5} | {rec['attendance']:<6.1f} | {status}")`,
    expectedOutput: `🎓 Final Semester Clearance Report:
Roll No    | Name         | Marks | Att %  | Status
----------------------------------------------------
26009479   | Abishek S    | 88    | 92.5   | ✅ PASS / CLEARED
26009480   | Bavithra M   | 0     | 68.0   | ❌ DETAINED / FAIL
26009481   | Chandru K    | 74    | 84.0   | ✅ PASS / CLEARED
26009482   | Dinesh D     | 92    | 95.0   | ✅ PASS / CLEARED`,
    codeExplanation: [
      'Merging on roll_no aligns records even if files were sorted differently.',
      'Replacing None / NaN with 0 prevents arithmetic errors when computing class statistics.',
      'Clearance status cleanly combines attendance and marks thresholds in a single pass.'
    ],
    predictChallenge: {
      question: 'In Pandas, what happens if you call df.dropna() without assigning it back (e.g. just df.dropna())?',
      options: [
        'The original DataFrame remains unmodified unless you pass inplace=True or assign df = df.dropna().',
        'It permanently deletes rows from the hard drive.',
        'It throws a syntax error.',
        'It fills all NaN with zeros.'
      ],
      correctIndex: 0,
      explanation: 'Most Pandas methods return a modified copy by default to prevent accidental data loss. You must either write df = df.dropna() or pass inplace=True.'
    },
    debugTrap: {
      buggyCode: `import pandas as pd
# Merging two DataFrames with different column names for roll no:
# df1 has 'roll_number' and df2 has 'student_id'
merged = pd.merge(df1, df2, on="roll_number")`,
      errorType: 'KeyError: \'roll_number\'',
      whatWentWrong: 'If both DataFrames do not share the exact same column name, pd.merge(..., on="name") will fail.',
      fix: 'Use pd.merge(df1, df2, left_on="roll_number", right_on="student_id").'
    },
    miniPractice: {
      challenge: 'Write a small script that takes a list of student records [{"name": "A", "score": 85}, {"name": "B", "score": None}] and replaces all missing scores with the class median of 70.',
      hint: 'rec["score"] = 70 if rec["score"] is None else rec["score"]',
      solutionCode: `students = [{"name": "A", "score": 85}, {"name": "B", "score": None}]
for s in students:
    if s["score"] is None:
        s["score"] = 70
print(students)  # [{'name': 'A', 'score': 85}, {'name': 'B', 'score': 70}]`
    },
    bridgeToNext: 'You have now mastered all 5 core units! Periods 31 to 45 transition into guided coding, debugging, and independent real-world software building.'
  }
];
