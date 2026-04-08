export const newsData = Array.from({ length: 20 }).map((_, index) => ({
    id: index.toString(), 
    title: `Новина ${index + 1}`, 
    description: `Це детальний опис для новини номер ${index + 1}.`, 
    image: 'https://via.placeholder.com/150', 
  }));
  
  export const contactsData = [
    {
      title: 'Викладачі',
      data: [{ id: '1', name: 'Іваненко І.І.' }, { id: '2', name: 'Петренко П.П.' }],
    },
    {
      title: 'Студенти',
      data: [{ id: '3', name: 'Сидоренко С.С.' }, { id: '4', name: 'Коваленко К.К.' }],
    },
  ];