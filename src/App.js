import classes from "./App.module.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_DIGIT: "choose-digit",
  DELETE_DIGIT: "delete-digit",
  CLEAR_DIGIT: "clear",
  EVALUATE: "evaluate",
};
const reducer = (state, { type, payload }) => {
  if (type === ACTIONS.ADD_DIGIT) {
    if (state.overwrite) {
      return {
        ...state,
        currentOper: payload.digit,
        overwrite: false,
      };
    }
    if (payload.digit === "0" && state.currentOper === "0") {
      return state;
    }
    if (payload.digit === "." && state.currentOper.includes(".")) {
      return state;
    }
    return {
      ...state,
      currentOper: `${state.currentOper || ""}${payload.digit}`,
    };
  }
  if (type === ACTIONS.CHOOSE_DIGIT) {
    if (state.currentOper == null && state.previousOper == null) {
      return state;
    }
    if (state.currentOper === null) {
      return { ...state, operation: payload.operation };
    }

    if (state.previousOper == null) {
      return {
        ...state,
        operation: payload.operation,
        previousOper: state.currentOper,
        currentOper: null,
      };
    }

    return {
      ...state,
      previousOper: evaluate(state),
      operation: payload.operation,
      currentOper: null,
    };
  }
  if (type === ACTIONS.EVALUATE) {
    if (
      state.operation == null ||
      state.previousOper == null ||
      state.currentOper == null
    ) {
      return state;
    }
    return {
      ...state,
      previousOper: null,
      overwrite: true,
      operation: null,
      currentOper: evaluate(state),
    };
  }

  if (type === ACTIONS.CLEAR_DIGIT) {
    return {};
  }
  if (type === ACTIONS.DELETE_DIGIT) {
    if (state.overwrite) {
      return { ...state, overwrite: false, currentOper: null };
    }
    if (state.currentOper == null) return state;
    if (state.currentOper === 1) {
      return { ...state, currentOper: null };
    }
    return { ...state, currentOper: state.currentOper.slice(0, -1) };
  }
};

const evaluate = ({ currentOper, previousOper, operation }) => {
  const prev = parseFloat(previousOper);
  const current = parseFloat(currentOper);
  if (isNaN(prev) || isNaN(current)) {
    return "";
  }

  let prevResult = "";

  switch (operation) {
    case "+":
      prevResult = prev + current;
      break;
    case "-":
      prevResult = prev - current;
      break;
    case "*":
      prevResult = prev * current;
      break;
    case "/":
      prevResult = prev / current;
      break;
  }
  return prevResult.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};
function App() {
  const [{ currentOper, previousOper, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  /* const createDigits = () => {
    const digits = [];

    for (let i = 1; i < 10; i++) {
      digits.push(<button key={i}>{i}</button>);
    }
    return digits;
  };
*/
  return (
    <div className={classes.App}>
      <div className={classes.calculator}>
        <div className={classes.display}>
          <span>
            {formatOperand(previousOper)}
            {operation}
          </span>
          <span>{formatOperand(currentOper)}</span>
        </div>
        <div className={classes.operators}>
          <OperationButton operation="+" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <OperationButton operation="/" dispatch={dispatch} />
          <OperationButton operation="*" dispatch={dispatch} />
          <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
            DEL
          </button>
          <button onClick={() => dispatch({ type: ACTIONS.CLEAR_DIGIT })}>
            AC
          </button>
        </div>
        <div className={classes.digits}>
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
