export default function disableClick(event) {
    event.preventDefault();
    event.stopPropagation();
}