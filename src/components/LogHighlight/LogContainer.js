import styled from "styled-components/macro";

const LogContainer = styled.div`
    /* 滚动槽 */
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(158, 158, 158, 0.185);
        box-shadow: inset 0 0 2px #000000;
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #00000096;
    }
    height: 400px;
    width: 100%;
    overflow-x: auto;
    flex: 1 0 auto;
    line-height: 1;
    background: rgb(23,23,23);
    border-radius: 5px;
    padding: 10px;

    // 移动端
    @media (max-width: 600px) {
        padding: 0px;
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
    .language-log {
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
    }
    .token {
        &.level.error.important {
            color: #dc5229;
        }
        &.string {
            color: #909e6a;    
        }
        &.warning {
            color: #c7a24d;
            font-weight: normal;
        }
        &.level.info.keyword {
            color: #666666;
            font-size: 11px !important;
        }
        &.property {
            color: #999999;
            font-weight: bold;
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