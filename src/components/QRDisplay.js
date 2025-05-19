import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
const QRDisplay = ({ payload }) => (<QRCodeCanvas value={JSON.stringify(payload)} size={256} />);
export default QRDisplay;