function Commanders({ onCommanderSelected }) {
    const { loading, error, data } = useQuery(GET_COMMANDERS);
  
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
  
    return (
      <select name='commander' onChange={onCommanderSelected}>
        {data.commanders.map((commander) => (
          <option key={commander.id} value={commander.breed}>
            {commander.breed}
          </option>
        ))}
      </select>
    );
  }
  