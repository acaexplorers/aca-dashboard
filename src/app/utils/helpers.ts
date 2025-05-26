function getDayFromDate(dateString: string): string {
    const daysOfWeek = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday',
    ];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  }
  