import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowAlert = (message, type) => {
    if (!['success', 'error', 'info', 'warn'].includes(type)) {
        console.error(`Invalid toast type: ${type}`);
        return;
    }

    toast[type](message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
    });
};

export default ShowAlert;