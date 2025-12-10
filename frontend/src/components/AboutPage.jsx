import React from 'react';

function AboutPage() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400"
                    alt="Subway Fast Food"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h1 className="text-5xl font-bold mb-2">🥪 Subway Fast Food</h1>
                    <p className="text-xl text-gray-200">Fresh • Fast • Delicious</p>
                </div>
            </div>

            {/* About Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Story Section */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-3xl">📖</span> Our Story
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Welcome to <strong>Subway Fast Food</strong> – your ultimate destination for fresh,
                        delicious, and customizable fast food! Founded with a passion for quality ingredients
                        and customer satisfaction, we've been serving our community since 2010.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Our mission is simple: to provide fresh, made-to-order meals that satisfy your
                        cravings while keeping you healthy. Every sandwich, pizza, and salad is crafted
                        with love using only the finest ingredients.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Whether you're grabbing a quick lunch, enjoying a family dinner, or ordering for
                        a party, Subway Fast Food has something for everyone!
                    </p>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400"
                            alt="Fresh Sandwich"
                            className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"
                            alt="Pizza"
                            className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
                            alt="Fresh Salad"
                            className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400"
                            alt="Beverages"
                            className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-4">🥗</div>
                    <h3 className="text-xl font-bold mb-2">Fresh Ingredients</h3>
                    <p className="text-green-100">We use only the freshest vegetables, premium meats, and artisan breads daily.</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold mb-2">Fast Service</h3>
                    <p className="text-orange-100">Quick preparation without compromising quality. Your order ready in minutes!</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                    <p className="text-blue-100">Our smart chatbot helps you order easily and answers all your questions!</p>
                </div>
            </div>

            {/* Contact & Location */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-3xl">📍</span> Visit Us
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <span className="text-2xl">👤</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Owner</h4>
                            <p className="text-gray-600">Ameer Gul</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 p-3 rounded-full">
                            <span className="text-2xl">🏠</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Address</h4>
                            <p className="text-gray-600">Gulshan-e-Mazdoor<br />Karachi, Pakistan</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <span className="text-2xl">📞</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Phone</h4>
                            <p className="text-gray-600">0315-1095812</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                            <span className="text-2xl">⏰</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Hours</h4>
                            <p className="text-gray-600">Mon-Sun: 10AM - 11PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Restaurant Image */}
            <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200"
                    alt="Restaurant Interior"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h3 className="text-3xl font-bold mb-2">🥪 Subway Fast Food</h3>
                        <p className="text-xl">Where Every Bite is a Delight!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
