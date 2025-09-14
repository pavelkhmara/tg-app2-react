
export function useTelegram() {
    const tg = window.Telegram.WebApp;

    const onClose = () => {
        if (tg?.close) {
            tg.close();
        } else {
            alert('Закрытие доступно только внутри Telegram WebApp');
        }
    }

    const onToggleButton = () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }

    return {
        tg,
        onClose,
        onToggleButton,
        user: tg.initDataUnsafe?.user,
        queryId: tg.initDataUnsafe?.query_id,
    };
}