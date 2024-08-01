export default function Menu({ clients, selectClient, selectedClient }) {
    return (
        <aside className="w-1/3 bg-white border-r border-gray-300 p-4 overflow-y-auto">
            <header>
                <h2 className="font-bold text-lg mb-4">Recent</h2>
            </header>
            <ul>
                {clients.map((client, index) => (
                    <li
                        key={index}
                        onClick={() => selectClient(client)}
                        className={`py-4 px-2 cursor-pointer hover:bg-gray-100 ${selectedClient === client ? 'bg-blue-100' : ''}`}
                    >
                        <div className="flex items-center">
                            <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <div className="font-bold">{client.name}</div>
                                <div className="text-gray-500 text-sm">{client.message}</div>
                            </div>
                            <div className="ml-auto text-gray-400 text-xs">{client.date}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
