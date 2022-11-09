import React from 'react'
import Shortcuts from '../../components/Shortcuts/Shortcuts'
import AddPhotoAlternateSharpIcon from '@mui/icons-material/AddPhotoAlternateSharp';
import './index.css'

// 随机生成颜色
function randomColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')
}

function index() {
    return (
        <div className="test group">
            {Array.from(new Array(10).keys()).map((index) => {
                const color = randomColor()
                return <Shortcuts color={color} key={index} text={color} icon={<AddPhotoAlternateSharpIcon fontSize="large" />} />
            })}
        </div>
    )
}

export default index