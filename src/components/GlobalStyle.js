import { createGlobalStyle } from "styled-components/macro";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
    overflow-x: hidden;
  }

  body {
    background: ${(props) => props.theme.palette.background.default};
    margin: 0;
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
  .transition {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  .transform {
    transform: scale(1,1)
  }
  .duration-300 {
    transition-duration: .3s
  }
  .opacity-0 {
    opacity: 0
  }
  .opacity-100 {
    opacity: 1
  }
  .scale-105 {
    transform: scale(1.05, 1.05);
  }
  .scale-100 {
    transform: scale(1,1);
  }

}

`;

export default GlobalStyle;
