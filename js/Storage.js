	
	const Storage = () =>
	{
		const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

		if( indexedDB === undefined ) 
		{
			console.warn( 'Storage: IndexedDB not available.' );
			
			const f = () => {};
			
			return { init:f, get:f, set:f, clear:f };
		}

		const name = 'app-storage';
		const version = 1;

		let database;

		return {
			init:( callback ) =>
			{
				const request = indexedDB.open( name, version );
				
				request.onupgradeneeded = ( event ) => 
				{
					const db = event.target.result;

					if( db.objectStoreNames.contains( 'states' ) === false )
						db.createObjectStore( 'states' );
				};

				request.onsuccess = ( event ) => 
				{
					database = event.target.result;
					callback();
				};

				request.onerror = ( event ) => console.error( 'IndexedDB', event );
			},

			get:( callback ) =>
			{
				const transaction = database.transaction( [ 'states' ], 'readwrite' );
				const objectStore = transaction.objectStore( 'states' );
				const request = objectStore.get( 0 );
				
				request.onsuccess = ( event ) => callback( event.target.result );
			},

			set:( data ) =>
			{
				const start = performance.now();
				const transaction = database.transaction( [ 'states' ], 'readwrite' );
				const objectStore = transaction.objectStore( 'states' );
				const request = objectStore.put( data, 0 );
				
				request.onsuccess = () => console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );
			},

			clear:() =>
			{
				if( database === undefined ) return;

				const transaction = database.transaction( [ 'states' ], 'readwrite' );
				const objectStore = transaction.objectStore( 'states' );
				const request = objectStore.clear();
				
				request.onsuccess = console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Cleared IndexedDB.' );
			},
		};
	};
