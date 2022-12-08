import styled from "styled-components/macro";

const LogContainer = styled.div`
    /* 滚动槽 */
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        border-radius: 5px;
        background: rgba(158, 158, 158, 0.185);
        box-shadow: inset 0 0 0px #000000;
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #ffffff80;
    }
    height: 200px;
    width: 100%;
    overflow-x: auto;
    flex: 1 0 auto;
    line-height: 1;
    background: rgba(12,12,13);
    // padding: 4px;
    padding-top: 8px;
    padding-right: 4px;
    padding-left: 8px;
    padding-bottom: 8px;
    // border: 1px solid rgba(255, 255, 255, 0.04);

    // 移动端
    @media (max-width: 600px) {
        code {
            font-size: 10px !important;
        }
        .token.date.number ,.token.time.number ,.token.number {
            font-size: 10px !important;
        }
    }
    code {
        font-size: 11px !important;
        line-height: 1.8 !important;
    }
    ${props => props.highlightLevelLine ? `.language-log {
        text-shadow: none;
        color: #999999;
        &.error {
            color: #dc5229 !important;
            .token.date.number ,.token.time.number ,.token.number ,.token.string{
                color: #dc5229;
            }
        }
        &.info {
            color: #999999;
        }
        &.warning {
            color: #c7a24d !important;
            .token.date.number ,.token.time.number ,.token.number {
                color: #c7a24d;
            }
        }
    }` : `
        // 全息日志自立为王
        .language-log {
            color: #999999;
        }
        // .token.reason {
        //     color: #6e995c;
        // }
        .token.site {
            color: #999999;
            font-weight: bold;
        }

    `}
    .token {
        &.level.error.important {
        color: #dc5229;
    }
        &.hash.constant {
        color: #6e995c;    
    }
        &.url {
        color: #6e995c;    
    }
        &.reason {
        color: #6e995c;    
    }
        &.domain.constant {
        color: #6e995c;
    }
        &.string {
        color: #909e6a;
    }
    //     &.site {
    //     color: #999999;
    //     font-weight: bold;
    // }
        &.warning {
        color: #c7a24d;
        font-weight: normal;
    }
        &.level.info.keyword {
        color: #666666;
        font-size: 11px !important;
    }
        &.property {
        color: #dc5229;
        // font-weight: bold;
    }
        &.special {
        color: #dc5229;
        // font-weight: bold;
    }
        &.operator {
        color: #999999;
    }
        &.date.number {
        color: #4782b3;
        font-size: 11px !important;
    }
        &.time.number {
        color: #4782b3;
        font-size: 11px !important;
    }
        &.number {
        color: #4782b3;
        font-size: 11px !important;
    }
        &.ip-address.constant {
        color: #4782b3;
        font-size: 11px !important;
    }
}
`
export default LogContainer;
