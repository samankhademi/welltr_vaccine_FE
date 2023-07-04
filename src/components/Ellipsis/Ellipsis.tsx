import React from 'react';
import './Ellipsis.scss';


type EllipsisProps = {
    layoutStyle?: string,
    half?: boolean,
    marginTop?: string
}

const Ellipsis = ({
    layoutStyle = '',
    half = true,
    marginTop = "0"
}: EllipsisProps) => {
    return (
        <div
            style={{marginTop: marginTop}}
            className={`${layoutStyle}-ellipsis`}>
            <div className={`lds-ellipsis ${half && 'lds-ellipsis--half'}`}>
                <div>
                    <div/>
                </div>
                <div>
                    <div/>
                </div>
                <div>
                    <div/>
                </div>
                <div>
                    <div/>
                </div>
                <div>
                    <div/>
                </div>
            </div>
        </div>
    );
};

export default Ellipsis;
