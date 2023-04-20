export function convertDate(dateString: string): string {
	const dateObj = new Date(dateString);
	const date = dateObj.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
	const time = dateObj.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});

	const [month, day, year] = date.split(' ');
	const [formattedTime, period] = time.split(' ');

	const formattedDate = `${day} ${month} ${year}, ${formattedTime} ${period}`;
	return formattedDate.replace(',', '');
}

export function getCurrentTimestamp() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const year = String(now.getFullYear()).slice(-2);

	return `${hours}:${minutes}:${seconds}, ${day}.${month}.${year}`;
}
