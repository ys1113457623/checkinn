
import React, { useRef, useState } from 'react';


const BaseTemplate = (props) => {
    const [blockView, setBlockView] = useState('PREVIEW');
    const actionCopyRef = useRef(null);

    const copyCode = async (event) => {
        await navigator.clipboard.writeText(props.code);
        event.preventDefault();
    };

    return (
        <div className="block-viewer">
          {props.sampleTextProp.sampleTextProp}
            
        </div>
    );
};

export default BaseTemplate;
