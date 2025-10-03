# Customised Calculator

A modern, feature-rich calculator built with vanilla JavaScript that supports variables, mathematical functions, and calculation history. This calculator provides a clean, intuitive interface for both basic arithmetic and advanced mathematical operations.

## Features

### Core Functionality

- **Basic Arithmetic**: Addition, subtraction, multiplication, division
- **Advanced Operations**: Exponentiation, parentheses for complex expressions
- **Mathematical Functions**: sin, cos, tan, square root
- **Constants**: Built-in support for π (pi) and e
- **Variable Support**: Create, manage, and use custom variables in calculations
- **Calculation History**: View, navigate, and manage your calculation history
- **Statistics**: Track calculation counts and view recent operations

### User Interface

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern Styling**: Clean, professional interface with smooth animations
- **Keyboard Support**: Full keyboard navigation and shortcuts
- **Real-time Validation**: Immediate feedback on invalid expressions or undefined variables

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start calculating!

### File Structure

```bash
Customised-Calculator/
├── index.html                  # Main HTML file
├── constants/
│   └── constants.js            # Configuration and constants
├── services/
│   └── calculation-service.js  # Core calculator logic
├── styles/
│   └── styles.css             # Styling and animations
└── README.md                  # This file
```

## How to Use

### Basic Calculations

1. **Type expressions directly** in the input field
2. **Use the calculator buttons** for numbers and operators
3. **Press Enter** or click the equals button (=) to calculate
4. **Press Escape** to clear the input

### Using Variables

1. **Add a variable**:
   - Enter a variable name in the "Variable Name" field
   - Enter a numeric value in the "Variable Value" field
   - Click "Add Variable"

2. **Use variables in calculations**:
   - Type the variable name directly in expressions
   - Or use the dropdown to select and insert variables
   - Example: `x + y` where x=5 and y=3

3. **Manage variables**:
   - View all variables in the variables list
   - Delete variables using the × button
   - Variables are validated to prevent conflicts with reserved words

### Mathematical Functions

- **Trigonometric**: `sin(pi/2)`, `cos(0)`, `tan(45)`
- **Square Root**: `sqrt(16)`
- **Constants**: Use `pi` for π and `e` for Euler's number
- **Combined**: `sin(pi/4) + cos(pi/4)`

### History Management

- **View History**: Click "View All" to see all calculations
- **Navigate**: Use Previous/Next buttons to browse individual calculations
- **Clear History**: Use "Clear All" to remove all history
- **Statistics**: Click "Stats" to see calculation counts and recent operations

## Keyboard Shortcuts

- **Enter**: Calculate the current expression
- **Escape**: Clear the input field
- **Escape** (in modal): Close the history modal

## Technical Details

### Architecture

The calculator uses a modular architecture with clear separation of concerns:

- **Constants**: Centralized configuration and error messages
- **Services**: Core calculation logic and state management
- **Styles**: Modern CSS with custom properties and animations
- **HTML**: Semantic markup with accessibility considerations

### Key Technologies

- **Vanilla JavaScript**: No external dependencies
- **ES6 Modules**: Modern module system for better organization
- **CSS Custom Properties**: Consistent theming and maintainable styles
- **Responsive Design**: Mobile-first approach with flexible layouts

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Error Handling

The calculator provides clear feedback for various error conditions:

- **Invalid Expressions**: Syntax errors or unsupported operations
- **Undefined Variables**: Using variables that haven't been defined
- **Invalid Variable Names**: Reserved words or invalid characters
- **Invalid Values**: Non-numeric values for variables

## Customization

### Styling

The calculator uses CSS custom properties for easy theming. Key variables in `styles/styles.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-primary: #2d3748;
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.1);
  /* ... and more */
}
```

### Configuration

Modify `constants/constants.js` to adjust:

- Decimal precision
- Reserved words
- Error messages
- Supported operators

## Development

### Adding New Features

1. **Mathematical Functions**: Add to the `safeEvaluate` function
2. **UI Components**: Extend the HTML and add corresponding JavaScript
3. **Styling**: Use existing CSS custom properties for consistency

### Code Organization

- Keep business logic in `services/calculation-service.js`
- Store configuration in `constants/constants.js`
- Maintain styling in `styles/styles.css`
- Use semantic HTML in `index.html`

## Troubleshooting

### Common Issues

1. **Calculator not responding**: Check browser console for JavaScript errors
2. **Variables not working**: Ensure variable names don't conflict with reserved words
3. **Modal not opening**: Verify all files are in the correct directory structure

### Browser Console

Open the browser console (F12) to see:

- Module loading status
- Function exposure confirmation
- Error messages and debugging information

## License

This project is open source and available under the MIT License.
