function Footer() {
  return (
    <footer className="bg-gray-800 text-white absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Galileo</h3>
              <p className="text-gray-400 text-sm">
                Your trusted Stellar address lookup tool
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                API
              </a>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer